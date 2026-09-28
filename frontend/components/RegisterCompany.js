const RegisterCompany = {
  template: `
    <div class="auth-wrapper">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-5">
                    
                    <div class="glass-card p-4 p-md-5">
                        <div class="auth-header">
                            <h2>Partner with Us</h2>
                            <p>Register your company for placements</p>
                        </div>
                        
                        <div v-if="error" class="alert alert-danger" style="background: rgba(220, 53, 69, 0.1); border-color: rgba(220, 53, 69, 0.3); color: #ff6b6b;">
                            {{ error }}
                        </div>

                        <form @submit.prevent="register">
                            <div class="mb-4">
                                <label class="form-label">Contact Name</label>
                                <input v-model="name" type="text" class="form-control custom-input" placeholder="Jane Doe" required>
                            </div>
                            
                            <div class="mb-4">
                                <label class="form-label">Company Name</label>
                                <input v-model="companyName" type="text" class="form-control custom-input" placeholder="Acme Corp" required>
                            </div>

                            <div class="mb-4">
                                <label class="form-label">Email Address</label>
                                <input v-model="email" type="email" class="form-control custom-input" placeholder="hr@acmecorp.com" required>
                            </div>
                            
                            <div class="mb-5">
                                <label class="form-label">Password</label>
                                <input v-model="password" type="password" class="form-control custom-input" placeholder="••••••••" required>
                            </div>

                            <button type="submit" class="btn btn-primary-custom w-100 mb-4">
                                Submit Registration
                            </button>
                        </form>

                        <div class="auth-links text-center mt-3">
                            <p class="text-secondary mb-2">Already have an account?</p>
                            <a href="#/login">Back to Login</a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
  `,

  data() {
    return {
      name: "",
      companyName: "",
      email: "",
      password: "",
      error: ""
    };
  },

  methods: {
    async register() {
      const response = await fetch(API + "/auth/register/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: this.name,
          company_name: this.companyName,
          email: this.email,
          password: this.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful. Wait for admin approval.");
        this.$router.push("/login");
      }
      else {
        this.error = data.error;
      }
    }
  }
};

