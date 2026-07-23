import { AP_CHEMISTRY } from "@/data/subjects";
import { SubjectExperience } from "@/components/SubjectExperience";

// Home renders AP Chemistry, the flagship subject. Other subjects live at
// /<subject-id> via the [subject] route.
export default function Home() {
  return <SubjectExperience subject={AP_CHEMISTRY} />;
}
