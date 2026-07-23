import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SUBJECTS, AVAILABLE_SUBJECT_IDS } from "@/data/subjects";
import { SubjectExperience } from "@/components/SubjectExperience";

// Static export needs every route enumerated up front.
export function generateStaticParams() {
  return AVAILABLE_SUBJECT_IDS.map((subject) => ({ subject }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string }>;
}): Promise<Metadata> {
  const { subject: id } = await params;
  const subject = SUBJECTS[id];
  if (!subject) return {};
  return {
    title: `Why Might ${subject.discipline} Feel So Hard?`,
    description: `Explore the history of ${subject.discipline.toLowerCase()} and compare it with the order concepts are introduced in ${subject.name}.`,
  };
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject: id } = await params;
  const subject = SUBJECTS[id];
  if (!subject) notFound();
  return <SubjectExperience subject={subject} />;
}
