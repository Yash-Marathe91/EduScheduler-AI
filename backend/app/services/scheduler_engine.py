from ortools.sat.python import cp_model
from typing import List, Dict, Any

class TimetableScheduler:
    def __init__(
        self, 
        days: int = 6, 
        periods_per_day: int = 6, 
        period_duration: int = 60
    ):
        """
        Initialize the Timetable Scheduler using OR-Tools CP-SAT Solver.
        """
        self.days = days
        self.periods = periods_per_day
        self.model = cp_model.CpModel()
        self.assignments = {} # decision variables

    def generate_schedule(self, batches: List[dict], faculty: List[dict], subjects: List[dict], classrooms: List[dict], requirements: List[dict]):
        """
        Generate a conflict-free schedule based on requirements.
        """
        
        # 1. Decision Variables
        # X[r, c, d, p, rm] = 1 if requirement `r`, instance `c` is scheduled on day `d`, period `p`, in room `rm`
        
        req_vars = {}
        for r_idx, req in enumerate(requirements):
            req_vars[r_idx] = {}
            for c in range(req['count']):
                req_vars[r_idx][c] = {}
                for d in range(self.days):
                    req_vars[r_idx][c][d] = {}
                    for p in range(self.periods):
                        req_vars[r_idx][c][d][p] = {}
                        for rm in classrooms:
                            # Constrain room type by lab requirement to heavily reduce search space
                            if req.get('is_lab', False) and not rm.get('is_lab', False):
                                continue # Cannot put lab in lecture room
                            if not req.get('is_lab', False) and rm.get('is_lab', False):
                                continue # Cannot put lecture in lab room
                                
                            var_name = f"r{r_idx}_c{c}_d{d}_p{p}_rm{rm['id']}"
                            req_vars[r_idx][c][d][p][rm['id']] = self.model.NewBoolVar(var_name)
                            
        # 2. Hard Constraints
        
        # C1: Each requirement instance must be scheduled exactly once
        for r_idx, req in enumerate(requirements):
            for c in range(req['count']):
                all_vars_for_instance = []
                for d in range(self.days):
                    for p in range(self.periods):
                        for rm_id in req_vars[r_idx][c][d][p]:
                            all_vars_for_instance.append(req_vars[r_idx][c][d][p][rm_id])
                self.model.AddExactlyOne(all_vars_for_instance)

        # C2: Faculty cannot teach two classes at the same time
        faculty_reqs = {}
        for r_idx, req in enumerate(requirements):
            f_id = req['faculty_id']
            if f_id not in faculty_reqs:
                faculty_reqs[f_id] = []
            faculty_reqs[f_id].append(r_idx)

        for f_id, r_indices in faculty_reqs.items():
            for d in range(self.days):
                for p in range(self.periods):
                    vars_in_timeslot = []
                    for r_idx in r_indices:
                        for c in range(requirements[r_idx]['count']):
                            for rm_id in req_vars[r_idx][c][d][p]:
                                vars_in_timeslot.append(req_vars[r_idx][c][d][p][rm_id])
                    self.model.AddAtMostOne(vars_in_timeslot)

        # C3: Batch cannot have two classes at the same time
        batch_reqs = {}
        for r_idx, req in enumerate(requirements):
            b_id = req['batch_id']
            if b_id not in batch_reqs:
                batch_reqs[b_id] = []
            batch_reqs[b_id].append(r_idx)

        for b_id, r_indices in batch_reqs.items():
            for d in range(self.days):
                for p in range(self.periods):
                    vars_in_timeslot = []
                    for r_idx in r_indices:
                        for c in range(requirements[r_idx]['count']):
                            for rm_id in req_vars[r_idx][c][d][p]:
                                vars_in_timeslot.append(req_vars[r_idx][c][d][p][rm_id])
                    self.model.AddAtMostOne(vars_in_timeslot)
                    
        # C4: A classroom cannot be double-booked
        for rm in classrooms:
            rm_id = rm['id']
            for d in range(self.days):
                for p in range(self.periods):
                    vars_in_room = []
                    for r_idx, req in enumerate(requirements):
                        for c in range(req['count']):
                            if rm_id in req_vars[r_idx][c][d][p]:
                                vars_in_room.append(req_vars[r_idx][c][d][p][rm_id])
                    self.model.AddAtMostOne(vars_in_room)

        # 3. Soft Constraints / Objective
        # Maximize consecutive classes (minimize gaps) or evenly distribute classes over days
        # We will keep it simple for now to ensure fast generation: Feasibility first.

        # 4. Solve the Model
        solver = cp_model.CpSolver()
        # Set a time limit for the solver to 15 seconds
        solver.parameters.max_time_in_seconds = 15.0
        
        status = solver.Solve(self.model)

        if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
            # Extract the solution
            schedule = []
            for r_idx, req in enumerate(requirements):
                for c in range(req['count']):
                    for d in range(self.days):
                        for p in range(self.periods):
                            for rm_id, var in req_vars[r_idx][c][d][p].items():
                                if solver.Value(var):
                                    schedule.append({
                                        "batch_id": req["batch_id"],
                                        "subject_id": req["subject_id"],
                                        "faculty_id": req["faculty_id"],
                                        "classroom_id": rm_id,
                                        "day": d,
                                        "period": p,
                                        "is_lab": req.get("is_lab", False)
                                    })
            return {"status": "success", "schedule": schedule}
        else:
            return {"status": "failed", "message": "No feasible schedule found. Ensure there are enough classrooms and time slots for the requirements."}
