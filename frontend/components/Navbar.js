const Navbar = {
  template: `
    <nav class="navbar navbar-dark sticky-top">
      <div class="container-fluid d-flex justify-content-between align-items-center">
        <span class="navbar-brand fw-bold m-0" style="background: linear-gradient(135deg, #7b88eb 0%, #ffffff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          <i class="bi bi-mortarboard-fill me-2" style="color: #5e6ad2"></i>Placement Portal
        </span>
        <div>
          <button v-if="isLoggedIn" @click="logout" class="btn btn-outline-danger btn-sm px-3 fw-semibold" style="border-radius: 8px;">Logout</button>
          <a v-else href="#/login" class="btn btn-primary-custom btn-sm px-4 py-2 fw-semibold">Login</a>
        </div>
      </div>
    </nav>
  `,
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem("token");
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/login").then(() => {
        window.location.reload();
      });
    }
  }
};
