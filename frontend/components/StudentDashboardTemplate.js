const studentDashboardTemplate = `
    <DashboardLayout title="Student Dashboard">

      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <a class="nav-link" :class="{ active: tab === 'profile' }" href="#" @click.prevent="tab = 'profile'">Profile</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: tab === 'drives' }" href="#" @click.prevent="tab = 'drives'">Placement Drives</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: tab === 'applications' }" href="#" @click.prevent="tab = 'applications'">My Applications</a>
        </li>
      </ul>

      <div v-if="tab === 'profile'">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="mb-0" style="color: var(--text-primary);">My Profile</h4>
        </div>

        <div class="glass-card mx-auto" style="max-width: 600px;">
          <div class="p-4 p-md-5">
            <form @submit.prevent="updateProfile">

              <div class="row mb-4">
                <div class="col-md-6">
                  <label class="form-label">Roll Number</label>
                  <input v-model="student.roll_number" class="form-control custom-input" placeholder="Roll Number">
                </div>
                <div class="col-md-6 mt-3 mt-md-0">
                  <label class="form-label">Branch</label>
                  <input v-model="student.branch" class="form-control custom-input" placeholder="Computer Science">
                </div>
              </div>

              <div class="row mb-4">
                <div class="col-md-6">
                  <label class="form-label">Year of Passing</label>
                  <input v-model="student.year" type="number" class="form-control custom-input" placeholder="e.g. 2024">
                </div>
                <div class="col-md-6 mt-3 mt-md-0">
                  <label class="form-label">CGPA</label>
                  <input v-model="student.cgpa" type="number" step="0.01" class="form-control custom-input" placeholder="e.g. 8.5">
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label">Skills</label>
                <textarea v-model="student.skills" class="form-control custom-input" rows="3" placeholder="Python, Vue.js, SQL..."></textarea>
              </div>

              <div class="mb-5">
                <label class="form-label">Resume</label>
                <div v-if="student.resume" class="mb-3">
                  <a :href="backendUrl + '/' + student.resume" target="_blank" class="btn btn-sm btn-outline-info" style="border-radius: 8px;">
                    <i class="bi bi-file-earmark-text me-1"></i> View Current Resume
                  </a>
                  <span class="ms-2 small text-muted">Upload a new file to replace it</span>
                </div>
                <input type="file" class="form-control custom-input" @change="selectFile">
              </div>

              <button type="submit" class="btn btn-primary-custom w-100">Save Profile</button>

            </form>
          </div>
        </div>
      </div>


      <div v-if="tab === 'drives'">
        <h4 class="mb-3" style="color: var(--text-primary);">Placement Drives</h4>

        <div class="row">
          <div class="col-12 mb-4" v-for="drive in drives" :key="drive.id">
            <div class="glass-card p-4">
                <div class="row align-items-start">
                  
                  <div class="col-md-6 mb-3 mb-md-0">
                    <h5 class="mb-1" style="color: var(--accent); font-weight: 600;">{{ drive.job_title }}</h5>
                    <h6 class="mb-2 text-primary">{{ drive.company_name }}</h6>
                    <p class="small mb-0" style="color: var(--text-secondary);">{{ drive.job_description }}</p>
                  </div>
                  
                  <div class="col-md-4 mb-3 mb-md-0 border-start" style="border-color: var(--card-border) !important;">
                    <ul class="list-unstyled mb-0 ms-3">
                      <li class="mb-1"><strong class="text-muted">CTC:</strong> <span style="color: var(--text-primary);">{{ drive.salary_lpa }}</span></li>
                      <li><strong class="text-muted">Deadline:</strong> <span style="color: var(--text-primary);">{{ drive.application_deadline }}</span></li>
                    </ul>
                    
                    <div v-if="getApplication(drive.id) && getApplication(drive.id).interview_date" class="mt-3 ms-3 small" style="color: #17a2b8;">
                      <i class="bi bi-calendar-event me-1"></i>
                      <strong>Interview Date:</strong><br>{{ new Date(getApplication(drive.id).interview_date).toLocaleString('en-GB') }}
                    </div>
                  </div>

                  <div class="col-md-2 text-md-end text-start">
                    <button class="btn btn-primary-custom px-4" v-if="!getApplication(drive.id)" @click="apply(drive.id)">Apply Now</button>
                    
                    <span v-else class="badge px-3 py-2" :class="getBadgeClass(getApplication(drive.id).status)">
                      {{ getApplication(drive.id).status }}
                    </span>
                  </div>
                  
                </div>
            </div>
          </div>
          
          <div v-if="drives.length === 0" class="col-12 text-center text-muted py-4">
            <p>No active placement drives found.</p>
          </div>
        </div>
      </div>


      <div v-if="tab === 'applications'">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="mb-0" style="color: var(--text-primary);">My Applications</h4>
          <button class="btn btn-primary-custom btn-sm" @click="exportHistory">
            <i class="bi bi-download me-1"></i> Export Application History (CSV)
          </button>
        </div>

        <div class="row">
          <div class="col-12 mb-4" v-for="application in applications" :key="application.id">
            <div class="glass-card p-4">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 class="mb-0" style="color: var(--accent); font-weight: 600;">{{ application.job_title }}</h5>
                    <h6 class="mt-1" style="color: var(--text-primary);">{{ application.company_name }}</h6>
                  </div>
                  <span class="badge px-3 py-2" :class="getBadgeClass(application.status)">
                    {{ application.status }}
                  </span>
                </div>
                
                <div v-if="application.interview_date" class="mb-3" style="color: #17a2b8;">
                  <i class="bi bi-calendar-event me-1"></i>
                  <strong>Interview Date:</strong> {{ new Date(application.interview_date).toLocaleString('en-GB') }}
                </div>

                <div class="mt-4 p-3 rounded" style="background: rgba(0,0,0,0.2); border: 1px solid var(--card-border);">
                  <p class="mb-2 text-muted small"><strong><i class="bi bi-clock-history me-1"></i> Status History:</strong></p>
                  <p class="mb-0 small" style="white-space: pre-wrap; color: var(--text-secondary);">{{ formatHistory(application.logs) }}</p>
                </div>
            </div>
          </div>

          <div v-if="applications.length === 0" class="col-12 text-center text-muted py-4">
            <p>You haven't applied to any drives yet.</p>
          </div>
        </div>
      </div>

    </DashboardLayout>
`;
