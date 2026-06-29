"use client";

import { Person } from "./types";

import PersonCard from "./PersonCard";

type Props = {
  people: Person[];
};

export default function PersonGrid({ people }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
      {people.map((person) => (
        <PersonCard key={person._id} person={person} />
      ))}
    </div>
  );
}
