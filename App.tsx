import { BrowserRouter, Route, Routes } from "react-router-dom";

import SmoothScrollProvider from "@/components/provider/smooth-scroll-provider";

import AppLayout from "@/pages/layout";
import HomePage from "@/pages/home";
import ArchivePage from "@/pages/archive";
import BucketListPage from "@/pages/bucket-list";
import ContactPage from "@/pages/contact";
import ContactSuccessPage from "@/pages/contact-success";
import GuestbookPage from "@/pages/guestbook";
import LabPage from "@/pages/lab";
import LabDetailPage from "@/pages/lab-detail";
import MaterialPage from "@/pages/material";
import MentorshipPage from "@/pages/mentorship";
import PersonalPage from "@/pages/personal";
import PostPage from "@/pages/post";
import PostDetailPage from "@/pages/post-detail";
import ProjectDetailPage from "@/pages/project-detail";
import SwiftPage from "@/pages/swift";
import SwiftDetailPage from "@/pages/swift-detail";
import NotePage from "@/pages/note";
import AuthCallbackPage from "@/pages/auth-callback";
import NotFoundPage from "@/pages/not-found";

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/bucket-list" element={<BucketListPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/contact/success" element={<ContactSuccessPage />} />
            <Route path="/guestbook" element={<GuestbookPage />} />
            <Route path="/lab" element={<LabPage />} />
            <Route path="/lab/:slug" element={<LabDetailPage />} />
            <Route path="/material" element={<MaterialPage />} />
            <Route path="/mentorship" element={<MentorshipPage />} />
            <Route path="/personal" element={<PersonalPage />} />
            <Route path="/post" element={<PostPage />} />
            <Route path="/post/*" element={<PostDetailPage />} />
            <Route path="/project/:slug" element={<ProjectDetailPage />} />
            <Route path="/swift" element={<SwiftPage />} />
            <Route path="/swift/*" element={<SwiftDetailPage />} />
          </Route>
          <Route path="/note" element={<NotePage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </SmoothScrollProvider>
    </BrowserRouter>
  );
}
