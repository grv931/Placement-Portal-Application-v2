const Login = {
  template: `
    <div class="auth-wrapper">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-5">
                    
                    <div class="glass-card p-4 p-md-5">
                        <div class="auth-header">
                            <h2>Welcome Back</h2>
                            <p>Sign in to continue to the portal</p>
                        </div>
                        
                        <div v-if="error" class="alert alert-danger" style="background: rgba(220, 53, 69, 0.1); border-color: rgba(220, 53, 69, 0.3); color: #ff6b6b;">
                            {{ error }}
                        </div>

                        <form @submit.prevent="login">
                            <div class="mb-4">
                                <label class="form-label">Email Address</label>
                                <input type="email" class="form-control custom-input" v-model="email" placeholder="name@example.com" required>
                            </div>
                            <div class="mb-5">
                                <label class="form-label">Password</label>
                                <input type="password" class="form-control custom-input" v-model="password" placeholder="••••••••" required>
                            </div>

                            <button type="submit" class="btn btn-primary-custom w-100 mb-4">
                                Sign In
                            </button>
                        </form>

                        <div class="auth-links text-center mt-3">
                            <p class="text-secondary mb-2">New to the platform?</p>
                            <div class="d-flex justify-content-center gap-3">
                                <a href="#/register-student">Register as Student</a>
                                <span class="text-secondary">•</span>
                                <a href="#/register-company">Register as Company</a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
  `,

  data() {
    return {
      email: "",
      password: "",
      error: ""
    };
  },

  methods: {
    async login() {
      const response = await fetch(API + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.email,
          password: this.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        this.$router.push("/" + data.user.role + "/dashboard").then(() => {
          window.location.reload();
        });
      }
      else {
        this.error = data.error;
      }
    }
  }
};
