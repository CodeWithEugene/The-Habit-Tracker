import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Tab } from "@headlessui/react";
import { Dashboard } from "./Dashboard";
import { HabitsView } from "./HabitsView";
import { CalendarView } from "./CalendarView";
import { LandingPage } from "./LandingPage";

export default function App() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E90FF]"></div>
      </div>
    );
  }

  if (!loggedInUser) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h2 className="text-xl font-semibold accent-text">Habit Tracker</h2>
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold accent-text mb-4">Track Your Habits</h1>
              <p className="text-xl text-gray-600">
                Welcome back, {loggedInUser?.email ?? "friend"}!
              </p>
            </div>

            <Tab.Group>
              <Tab.List className="flex space-x-8 border-b border-gray-200/50">
                {["Dashboard", "Habits", "Calendar"].map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      `relative py-2 text-sm font-medium leading-5 transition-colors outline-none
                      ${
                        selected
                          ? "text-[#1E90FF]"
                          : "text-gray-600 hover:text-[#1E90FF]"
                      }
                      ${
                        selected
                          ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#1E90FF] after:transform after:transition-transform after:duration-300"
                          : ""
                      }`
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-6">
                <Tab.Panel>
                  <Dashboard />
                </Tab.Panel>
                <Tab.Panel>
                  <HabitsView />
                </Tab.Panel>
                <Tab.Panel>
                  <CalendarView />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
