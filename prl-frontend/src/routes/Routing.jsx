import React, { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Layouts & Primary Landing Page (kept eager for fast initial render)
import AppLayout from "../layout/AppLayout";
import Home from "../pages/Home/Home";

// Lazy-loaded Layouts & Frontend Pages
const AdminLayout = lazy(() => import("../layout/AdminLayout"));
const Blogs = lazy(() => import("../pages/Blogs/Blogs"));
const Contact = lazy(() => import("../pages/Contact-Us/Contact"));
const AllProducts = lazy(() => import("../pages/Products/AllProducts"));
const Windowmachine = lazy(() => import("../pages/Products/UpvcWindowMachine"));
const AluminumWindowMachine = lazy(
  () => import("../pages/Products/AluminumWindowMachine"),
);
const CaseStudiesPage = lazy(() => import("../casestudies/Casestudies"));
const ProductSlugPage = lazy(() => import("../pages/Products/ProductSlugPage"));
const LegacyProductRedirect = lazy(
  () => import("../pages/Products/LegacyProductRedirect"),
);

// Services Pages
const Services = lazy(() => import("../pages/services/Services"));
const MachineCustomization = lazy(
  () => import("../pages/services/MachineCustomization"),
);
const Installation = lazy(() => import("../pages/services/Installation"));
const Maintenance = lazy(() => import("../pages/services/Maintenance"));
const Training = lazy(() => import("../pages/services/Training"));
const BlogDetails = lazy(() => import("../pages/Blogs/Blogdetails"));
const FAQ = lazy(() => import("../pages/ourcompany/FAQ"));
const OurTeam = lazy(() => import("../pages/ourcompany/OurTeam"));
const News = lazy(() => import("../pages/ourcompany/News"));
const MissionVision = lazy(() => import("../pages/ourcompany/Mission-vission"));
const AboutPage = lazy(() => import("../pages/ourcompany/AboutPage"));
const OurCompanyPage = lazy(() => import("../pages/ourcompany/OurCompany"));
const Blogspage = lazy(() => import("../pages/ourcompany/OurBlogs"));

// 🛠️ Admin Pages
const DashboardPage = lazy(() => import("../admin/sidebarpages/DashboardPage"));
const Adminblog = lazy(() => import("../admin/sidebarpages/Adminblog"));
const AdminContact = lazy(() => import("../admin/sidebarpages/AdminContact"));
const AdminFooter = lazy(() => import("../admin/sidebarpages/AdminFooter"));
const AdminNarbar = lazy(() => import("../admin/sidebarpages/AdminNarbar"));
const AdminProducts = lazy(() => import("../admin/sidebarpages/AdminProducts"));
const AdminUpvcProducts = lazy(
  () => import("../admin/sidebarpages/AdminProductspages/AdminUpvcProducts"),
);
const AdminAluminumProducts = lazy(
  () => import("../admin/sidebarpages/AdminProductspages/AdminAluminumProducts"),
);
const AdminSeoManager = lazy(
  () => import("../admin/sidebarpages/AdminSeoManager"),
);
const AdminProfile = lazy(
  () => import("../admin/adminnavorfootersidebar/AdminProfile"),
);
const AdminSettings = lazy(
  () => import("../admin/adminnavorfootersidebar/AdminSettings"),
);

// 🔑 Admin Login & Misc Pages
const AdminLogin = lazy(() => import("../admin/AdminLogin"));
const MakinoPage = lazy(() => import("../pages/turnkey/TurnKey"));
const TurnkeyPage = lazy(() => import("../pages/turnkey/TurnKey"));
const TurnkeyDetailPage = lazy(
  () => import("../pages/turnkey/TurnkeyDetailPage"),
);
const Admintestimonial = lazy(
  () => import("../admin/sidebarpages/Admintestimonial"),
);
const PrivacyPolicy = lazy(() => import("../components/Privacy-policy"));
const TermsAndConditions = lazy(() => import("../components/Term-conditiom"));
const EnquiryForm = lazy(() => import("../components/EnquiryForm"));
const MachinePage = lazy(() => import("../pages/Products/AluminumWindowMachine"));
const ProductDetailPage = lazy(
  () => import("../pages/Products/ProductDetailuPVC"),
);

const RouteFallback = () => (
  <div className="min-h-[40vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600" />
  </div>
);

const withSuspense = (element) => (
  <Suspense fallback={<RouteFallback />}>{element}</Suspense>
);

// ✅ Auth check function
const isAuthenticated = () => {
  return localStorage.getItem("token") ? true : false;
};

// ✅ Protect Route wrapper
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  // 🌐 Frontend Routes
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "blogs", element: withSuspense(<Blogs />) },
      { path: "products", element: withSuspense(<AllProducts />) },
      {
        path: "products/uPVC-window-making-machine-price",
        element: withSuspense(<Windowmachine />),
      },
      {
        path: "products/:categorySlug",
        element: withSuspense(<MachinePage />),
      },
      {
        path: "products/:categorySlug",
        element: withSuspense(<Windowmachine />),
      },
      {
        path: "products/aluminum-window-machines",
        element: withSuspense(<AluminumWindowMachine />),
      },
      {
        path: "products/:categorySlug/:productSlug",
        element: withSuspense(<LegacyProductRedirect />),
      },
      {
        path: "products/:productSlug",
        element: withSuspense(<ProductSlugPage />),
      },
      { path: "contact-us", element: withSuspense(<Contact />) },
      { path: "privacy-policy", element: withSuspense(<PrivacyPolicy />) },
      {
        path: "terms-and-conditions",
        element: withSuspense(<TermsAndConditions />),
      },
      { path: "case-studies", element: withSuspense(<CaseStudiesPage />) },
      { path: "product-detail/:id", element: withSuspense(<ProductDetailPage />) },
      { path: "blogs/:slug", element: withSuspense(<BlogDetails />) },
      { path: "enquiry", element: withSuspense(<EnquiryForm />) },
      {
        path: "turn-key",
        element: withSuspense(<TurnkeyPage />),
      },
      { path: "turnkeydetailpage", element: withSuspense(<TurnkeyDetailPage />) },
      {
        path: "makinopage",
        element: withSuspense(<MakinoPage />),
      },
      // 🏢 Our Company Nested Routes
      {
        path: "our-company",
        element: withSuspense(<OurCompanyPage />),
        children: [
          { index: true, element: <Navigate to="about" replace /> },
          { path: "about-us", element: withSuspense(<AboutPage />) },
          { path: "faq", element: withSuspense(<FAQ />) },
          { path: "blogs", element: withSuspense(<Blogspage />) },
          { path: "our-team", element: withSuspense(<OurTeam />) },
          { path: "news", element: withSuspense(<News />) },
          { path: "mission-vision", element: withSuspense(<MissionVision />) },
        ],
      },

      // ⚙️ Services Nested Routes
      {
        path: "services",
        element: withSuspense(<Services />),
        children: [
          {
            index: true,
            element: <Navigate to="machine-customization" replace />,
          },
          {
            path: "machine-customization",
            element: withSuspense(<MachineCustomization />),
          },
          { path: "installation", element: withSuspense(<Installation />) },
          { path: "maintenance", element: withSuspense(<Maintenance />) },
          { path: "training", element: withSuspense(<Training />) },
        ],
      },
    ],
  },

  // 🔑 Admin Login Route
  {
    path: "/admin-login",
    element: withSuspense(<AdminLogin />),
  },

  // 🔐 Admin Protected Routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        {withSuspense(<AdminLayout />)}
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: withSuspense(<DashboardPage />) },
      { path: "blog", element: withSuspense(<Adminblog />) },
      { path: "contact", element: withSuspense(<AdminContact />) },
      { path: "footer", element: withSuspense(<AdminFooter />) },
      { path: "products", element: withSuspense(<AdminProducts />) },
      { path: "seo", element: withSuspense(<AdminSeoManager />) },
      { path: "navbar", element: withSuspense(<AdminNarbar />) },
      { path: "testimonial", element: withSuspense(<Admintestimonial />) },
      { path: "profile", element: withSuspense(<AdminProfile />) },
      { path: "settings", element: withSuspense(<AdminSettings />) },
      { path: "products/upvc", element: withSuspense(<AdminUpvcProducts />) },
      {
        path: "products/aluminum",
        element: withSuspense(<AdminAluminumProducts />),
      },
    ],
  },
]);

const Routing = () => {
  return <RouterProvider router={router} />;
};

export default Routing;
