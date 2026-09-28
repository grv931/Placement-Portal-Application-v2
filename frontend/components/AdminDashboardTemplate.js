const adminDashboardTemplate = `
    <DashboardLayout title="Admin Dashboard">

      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <a class="nav-link" :class="{ active: tab === 'stats' }" href="#" @click.prevent="tab = 'stats'">Stats</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: tab === 'students' }" href="#" @click.prevent="tab = 'students'">Students</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: tab === 'companies' }" href="#" @click.prevent="tab = 'companies'">Companies</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: tab === 'drives' }" href="#" @click.prevent="tab = 'drives'">Drives</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: tab === 'applications' }" href="#" @click.prevent="tab = 'applications'">Applications</a>
        </li>
      </ul>

      <div v-if="tab === 'stats'">
        <h4 class="mb-3" style="color: var(--text-primary);">Statistics</h4>
        <div class="row g-3 mb-4">
          <div class="col-md-3">
            <div class="glass-card text-center h-100 p-3">
                <h5 class="card-title text-muted">Students</h5>
                <h2 class="mb-0 text-primary" style="color: var(--accent) !important;">{{ stats.students }}</h2>
            </div>
          </div>
          <div class="col-md-3">
            <div class="glass-card text-center h-100 p-3">
                <h5 class="card-title text-muted">Companies</h5>
                <h2 class="mb-0 text-primary" style="color: var(--accent) !important;">{{ stats.companies }}</h2>
            </div>
          </div>
          <div class="col-md-3">
            <div class="glass-card text-center h-100 p-3">
                <h5 class="card-title text-muted">Drives</h5>
                <h2 class="mb-0 text-primary" style="color: var(--accent) !important;">{{ stats.drives }}</h2>
            </div>
          </div>
          <div class="col-md-3">
            <div class="glass-card text-center h-100 p-3">
                <h5 class="card-title text-muted">Applications</h5>
                <h2 class="mb-0 text-primary" style="color: var(--accent) !important;">{{ stats.applications }}</h2>
            </div>
          </div>
        </div>

        <div class="row g-4 mb-5">
          <div class="col-md-4">
            <div class="glass-card h-100 p-3">
                <h6 class="card-title text-muted text-center mb-3">Students Breakdown</h6>
                <div style="position:relative; height:220px;">
                  <canvas id="studentsChart"></canvas>
                </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="glass-card h-100 p-3">
                <h6 class="card-title text-muted text-center mb-3">Companies Breakdown</h6>
                <div style="position:relative; height:220px;">
                  <canvas id="companiesChart"></canvas>
                </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="glass-card h-100 p-3">
                <h6 class="card-title text-muted text-center mb-3">Drives Breakdown</h6>
                <div style="position:relative; height:220px;">
                  <canvas id="drivesChart"></canvas>
                </div>
            </div>
          </div>
        </div>

        <div class="row g-4 mb-5">
          <div class="col-md-12">
            <div class="glass-card p-4">
                <h6 class="card-title text-muted text-center mb-3">Placements Overview</h6>
                <div style="position:relative; height:150px;">
                  <canvas id="placementsChart"></canvas>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="tab === 'students'">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="mb-0" style="color: var(--text-primary);">Students</h4>
          <div class="input-group w-auto">
            <input v-model="studentSearch" class="form-control custom-input" placeholder="Search student">
            <button class="btn btn-primary-custom" @click="getStudents">Search</button>
          </div>
        </div>

        <div class="table-responsive glass-card">
          <table class="table table-hover mb-0 align-middle table-dark-custom">
            <thead>
              <tr>
                <th style="width: 20%">Name</th>
                <th style="width: 25%">Email</th>
                <th style="width: 20%">Roll Number</th>
                <th class="text-center" style="width: 15%">Status</th>
                <th class="text-end" style="width: 20%; border-top-right-radius: 24px;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in students" :key="student.id">
                <td>{{ student.name }}</td>
                <td>{{ student.email }}</td>
                <td>{{ student.roll_number}}</td>
                <td class="text-center">
                  <span class="badge" :class="student.is_blacklisted ? 'bg-danger' : 'bg-success'">
                    {{ student.is_blacklisted ? "Blacklisted" : "Active" }}
                  </span>
                </td>
                <td class="text-end">
                  <button class="btn btn-sm" :class="student.is_blacklisted ? 'btn-outline-success' : 'btn-outline-danger'" @click="blacklist(student.id)">
                    {{ student.is_blacklisted ? 'Unblacklist' : 'Blacklist' }}
                  </button>
                </td>
              </tr>
              <tr v-if="students.length === 0">
                <td colspan="5" class="text-center text-muted py-4">No students found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="tab === 'companies'"> 
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="mb-0" style="color: var(--text-primary);">Companies</h4>
          <div class="input-group w-auto">
            <input v-model="companySearch" class="form-control custom-input" placeholder="Search company">
            <button class="btn btn-primary-custom" @click="getCompanies">Search</button>
          </div>
        </div>

        <div class="table-responsive glass-card">
          <table class="table table-hover mb-0 align-middle table-dark-custom">
            <thead>
              <tr>
                <th style="width: 25%">Company</th>
                <th style="width: 25%">Website</th>
                <th class="text-center" style="width: 15%">Approval</th>
                <th class="text-center" style="width: 15%">Status</th>
                <th class="text-end" style="width: 20%; border-top-right-radius: 24px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="company in companies" :key="company.id">
                <td class="fw-medium">{{ company.company_name }}</td>
                <td>
                  <a v-if="company.website" :href="company.website.startsWith('http') ? company.website : 'https://' + company.website" target="_blank" style="color: var(--accent);">
                    {{ company.website }}
                  </a>
                  <span v-else class="text-muted small">N/A</span>
                </td>
                <td class="text-center">
                  <span class="badge" :class="company.approval_status === 'approved' ? 'bg-success' : (company.approval_status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark')">
                    {{ company.approval_status }}
                  </span>
                </td>
                <td class="text-center">
                  <span class="badge" :class="company.is_blacklisted ? 'bg-danger' : 'bg-success'">
                    {{ company.is_blacklisted ? "Blacklisted" : "Active" }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-success" v-if="company.approval_status !== 'approved'" @click="changeCompanyStatus(company.id, 'approved')">Approve</button>
                    <button class="btn btn-outline-danger" v-if="company.approval_status !== 'rejected'" @click="changeCompanyStatus(company.id, 'rejected')">Reject</button>
                    <button class="btn" :class="company.is_blacklisted ? 'btn-outline-secondary' : 'btn-outline-warning'" @click="blacklist(company.user_id)">
                      {{ company.is_blacklisted ? 'Unblacklist' : 'Blacklist' }}
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="companies.length === 0">
                <td colspan="5" class="text-center text-muted py-4">No companies found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="tab === 'drives'">
        <h4 class="mb-3" style="color: var(--text-primary);">Placement Drives</h4>

        <div class="table-responsive glass-card">
          <table class="table table-hover mb-0 align-middle table-dark-custom">
            <thead>
              <tr>
                <th style="width: 20%">Company</th>
                <th style="width: 25%">Job Title</th>
                <th style="width: 15%">CTC</th>
                <th style="width: 15%">Deadline</th>
                <th class="text-center" style="width: 10%">Status</th>
                <th class="text-end" style="width: 15%; border-top-right-radius: 24px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="drive in drives" :key="drive.id">
                <td class="fw-medium">{{ drive.company_name }}</td>
                <td>{{ drive.job_title }}</td>
                <td>{{ drive.salary_lpa }}</td>
                <td>{{ drive.application_deadline }}</td>
                <td class="text-center">
                  <span class="badge" :class="drive.status === 'approved' ? 'bg-success' : (drive.status === 'rejected' ? 'bg-danger' : (drive.status === 'closed' ? 'bg-secondary' : 'bg-warning text-dark'))">
                    {{ drive.status }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-success" v-if="drive.status !== 'approved'" @click="changeDriveStatus(drive.id, 'approved')">Approve</button>
                    <button class="btn btn-outline-danger" v-if="drive.status !== 'rejected'" @click="changeDriveStatus(drive.id, 'rejected')">Reject</button>
                    <button class="btn btn-outline-secondary" v-if="drive.status !== 'closed'" @click="changeDriveStatus(drive.id, 'closed')">Close</button>
                  </div>
                </td>
              </tr>
              <tr v-if="drives.length === 0">
                <td colspan="6" class="text-center text-muted py-4">No drives found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="tab === 'applications'">
        <h4 class="mb-3" style="color: var(--text-primary);">Applications</h4>

        <div class="table-responsive glass-card">
          <table class="table table-hover mb-0 align-middle table-dark-custom">
            <thead>
              <tr>
                <th style="width: 20%">Student</th>
                <th style="width: 20%">Company</th>
                <th style="width: 25%">Job</th>
                <th class="text-center" style="width: 15%">Status</th>
                <th class="text-end" style="width: 20%; border-top-right-radius: 24px;">Applied At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="application in applications" :key="application.id">
                <td class="fw-medium">{{ application.student_name }}</td>
                <td>{{ application.company_name }}</td>
                <td>{{ application.job_title }}</td>
                <td class="text-center">
                  <span class="badge" :class="{
                    'bg-warning text-dark': application.status === 'applied' || application.status === 'shortlisted' || application.status === 'interview',
                    'bg-info text-dark': application.status === 'offer',
                    'bg-success': application.status === 'placed',
                    'bg-danger': application.status === 'rejected'
                  }">
                    {{ application.status }}
                  </span>
                </td>
                <td class="text-end text-muted small">{{ application.applied_at }}</td>
              </tr>
              <tr v-if="applications.length === 0">
                <td colspan="5" class="text-center text-muted py-4">No applications found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
`;
