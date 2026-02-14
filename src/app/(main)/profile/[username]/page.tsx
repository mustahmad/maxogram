import ProfilePageClient from "./ProfilePageClient";

export function generateStaticParams() {
  return [
    { username: "maxo_user" },
    { username: "luna_captures" },
    { username: "dev_marcus" },
    { username: "aria_nomad" },
    { username: "chef_oliver" },
    { username: "fitnesswithsam" },
    { username: "neon_dreams" },
    { username: "bookish_emma" },
    { username: "urban_jay" },
  ];
}

export default function ProfilePage() {
  return <ProfilePageClient />;
}
