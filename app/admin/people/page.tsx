import { connectDB } from "@/lib/mongodb";

import Person from "@/models/Person";

import PersonGrid from "@/components/people/PersonGrid";
import PersonHeader from "@/components/people/PersonHeader";
import { Person as PersonType } from "@/components/people/types";
import PersonEmptyState from "@/components/people/PeopleEmptyState";

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  await connectDB();

  const people = (
    await Person.find({
      active: true,
    })
      .populate("representativePhoto")
      .lean()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ).filter((person: any) => person.representativePhoto);

  console.dir(people, { depth: null });

  people.forEach((person) => {
    if (!person.representativePhoto) {
      console.log("Missing representativePhoto:", person._id);
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serialized: PersonType[] = people.map((person: any) => ({
    ...person,

    _id: person._id.toString(),

    representativePhoto: {
      ...person.representativePhoto,

      _id: person.representativePhoto._id.toString(),
    },
  }));

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-8 p-8">
        <PersonHeader total={serialized.length} />

        {serialized.length === 0 ? (
          <PersonEmptyState />
        ) : (
          <PersonGrid people={serialized} />
        )}
      </div>
    </main>
  );
}
