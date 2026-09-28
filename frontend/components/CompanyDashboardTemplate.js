const companyDashboardTemplate = `
    <DashboardLayout title="Company Dashboard">

      <div v-if="company && company.approval_status !== 'approved'" class="alert alert-warning text-center" style="background: rgba(255, 193, 7, 0.1); border-color: rgba(255, 193, 7, 0.3); color: #ffc107;">
        <h4 class="alert-heading">Pending Approval</h4>
        <p class="mb-0">Your account is currently waiting for admin approval.</p>
      </div>

      <div v-else>

        <ul class="nav nav-tabs mb-4">
          <li class="nav-item">
            <a class="nav-link" :class="{ active: tab === 'stats' }" href="#" @click.prevent="tab = 'stats'">Stats</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: tab === 'drives' }" href="#" @click.prevent="tab = 'drives'">My Drives</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: tab === 'create' }" href="#" @click.prevent="tab = 'create'">Create Drive</a>
          </li>
        </ul>

        <div v-if="tab === 'stats'">
          <h4 class="mb-3" style="color: var(--text-primary);">Statistics</h4>
          
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <div class="glass-card text-center h-100 p-4">
                  <h5 class="card-title text-muted">Total Drives</h5>
                  <h2 class="mb-0" style="color: var(--accent) !important;">{{ total_drives }}</h2>
              </div>
            </div>
            <div class="col-md-6">
              <div class="glass-card text-center h-100 p-4">
                  <h5 class="card-title text-muted">Total Applications</h5>
                  <h2 class="mb-0" style="color: var(--accent) !important;">{{ total_applications }}</h2>
              </div>
            </div>
          </div>
          
          <button class="btn btn-primary-custom" @click="exportHistory">
             <i class="bi bi-download me-2"></i>Export Application History (CSV)
          </button>
        </div>

        <div v-if="tab === 'drives'">
          <h4 class="mb-3" style="color: var(--text-primary);">My Drives</h4>

          <div class="row">
            <div class="col-md-6 mb-4" v-for="drive in drives" :key="drive.id">
              <div class="glass-card h-100 p-4">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="mb-0" style="color: var(--accent); font-weight: 600;">{{ drive.job_title }}</h5>
                    <span class="badge" :class="drive.status === 'approved' ? 'bg-success' : (drive.status === 'rejected' ? 'bg-danger' : (drive.status === 'closed' ? 'bg-secondary' : 'bg-warning text-dark'))">
                      {{ drive.status }}
                    </span>
                  </div>
                  
                  <p class="text-muted small mb-3">{{ drive.job_description }}</p>
                  
                  <ul class="list-unstyled mb-4 small" style="color: var(--text-secondary);">
                    <li><strong class="text-primary">Eligibility:</strong> {{ drive.eligibility_criteria }}</li>
                    <li><strong class="text-primary">Salary:</strong> {{ drive.salary_lpa }} LPA</li>
                    <li><strong class="text-primary">Deadline:</strong> {{ drive.application_deadline }}</li>
                  </ul>
                  
                  <div class="d-flex gap-2">
                    <button class="btn btn-primary-custom btn-sm flex-grow-1" @click="getApplications(drive.id)">View Applications</button>
                    <button class="btn btn-outline-secondary btn-sm" style="border-radius: 8px;" @click="closeDrive(drive.id)" v-if="drive.status !== 'closed'">Close Drive</button>
                  </div>
              </div>
            </div>
            <div v-if="drives.length === 0" class="col-12 text-center text-muted py-4">
              <p>No drives created yet.</p>
            </div>
          </div>
        </div>

        <div v-if="tab === 'create'">
          <div class="glass-card mx-auto" style="max-width: 600px;">
            <div class="p-4 p-md-5">
              <div class="mb-4 text-center">
                <h4 class="mb-0" style="color: var(--text-primary); font-weight: 600;">Create Placement Drive</h4>
                <p class="text-muted small mt-1">Post a new opportunity for students</p>
              </div>

              <form @submit.prevent="createDrive">
                <div class="mb-4">
                  <label class="form-label">Job Title</label>
                  <input v-model="newDrive.job_title" class="form-control custom-input" placeholder="Software Engineer" required>
                </div>
                
                <div class="mb-4">
                  <label class="form-label">Job Description</label>
                  <textarea v-model="newDrive.job_description" class="form-control custom-input" rows="3" placeholder="Describe the role..." required></textarea>
                </div>

                <div class="mb-4">
                  <label class="form-label">Eligibility Criteria</label>
                  <textarea v-model="newDrive.eligibility_criteria" class="form-control custom-input" rows="2" placeholder="e.g. CGPA > 7.0, No backlogs" required></textarea>
                </div>

                <div class="row mb-5">
                  <div class="col-md-6 mb-4 mb-md-0">
                    <label class="form-label">Salary (LPA)</label>
                    <div class="input-group">
                      <input v-model="newDrive.salary_lpa" type="number" class="form-control custom-input" placeholder="10" style="border-top-right-radius: 0 !important; border-bottom-right-radius: 0 !important;" required>
                      <span class="input-group-text" style="background: rgba(255,255,255,0.05); color: var(--text-secondary); border: 1px solid rgba(255,255,255,0.1); border-left: none;">LPA</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Application Deadline</label>
                    <input v-model="newDrive.application_deadline" type="date" class="form-control custom-input" required>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary-custom w-100">Create Drive</button>
              </form>
            </div>
          </div>
        </div>

        <div v-if="tab === 'applications'">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="mb-0" style="color: var(--text-primary);">Applications</h4>
            <button class="btn btn-outline-secondary btn-sm" @click="tab = 'drives'" style="border-radius: 8px;">Back to Drives</button>
          </div>

          <div class="table-responsive glass-card">
            <table class="table table-hover mb-0 align-middle table-dark-custom">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th style="border-top-right-radius: 24px;">Status & Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="application in applications" :key="application.application_id">
                  <td class="align-middle">{{ application.student.name }}</td>
                  <td class="align-middle">{{ application.student.branch }}</td>
                  <td class="align-middle text-primary fw-bold">{{ application.student.cgpa }}</td>
                  <td>
                    <div class="d-flex flex-column gap-2" style="max-width: 200px;">
                      <select class="form-select form-select-sm custom-input" v-model="application.status" @change="updateStatus(application)">
                        <option value="applied" :disabled="isStatusDisabled(application.status, 'applied')">Applied</option>
                        <option value="shortlisted" :disabled="isStatusDisabled(application.status, 'shortlisted')">Shortlisted</option>
                        <option value="interview" :disabled="isStatusDisabled(application.status, 'interview')">Interview</option>
                        <option value="offer" :disabled="isStatusDisabled(application.status, 'offer')">Offer</option>
                        <option value="rejected" :disabled="isStatusDisabled(application.status, 'rejected')">Rejected</option>
                        <option value="placed" :disabled="isStatusDisabled(application.status, 'placed')">Placed</option>
                      </select>

                      <div v-if="application.status === 'interview'" class="input-group input-group-sm">
                        <span class="input-group-text" style="background: rgba(255,255,255,0.05); color: var(--text-secondary); border: 1px solid rgba(255,255,255,0.1);">Date</span>
                        <input type="datetime-local" class="form-control custom-input" style="border-radius: 0 12px 12px 0 !important;" v-model="application.interview_date" @change="updateStatus(application)">
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="applications.length === 0">
                  <td colspan="4" class="text-center text-muted py-4">No applications received yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
`;
