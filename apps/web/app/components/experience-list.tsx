"use client";

import { useState } from "react";
import { experiences } from "../lib/profile";

export function ExperienceList() {
  const [openCompanies, setOpenCompanies] = useState<Record<string, boolean>>({});

  const toggle = (company: string) => {
    setOpenCompanies((prev) => ({
      ...prev,
      [company]: !prev[company],
    }));
  };

  return (
    <div className="experience-container">
      <h2 className="text-xl font-bold experience-section-heading">Experience</h2>

      <div className="experience-list">
        {experiences.map((job) => {
          const isOpen = Boolean(openCompanies[job.company]);

          return (
            <div key={job.company} className="experience-card">
              <button
                type="button"
                className="experience-card-header"
                onClick={() => toggle(job.company)}
                aria-expanded={isOpen}
                aria-controls={`exp-content-${job.company.replace(/\s+/g, "-")}`}
              >
                <div className="experience-row-top">
                  <div className="experience-company-title-wrap">
                    <span className="experience-company-title">{job.company}</span>
                    <span
                      className={`experience-arrow-icon ${isOpen ? "open" : ""}`}
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 16 16"
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 3.5 L10.5 8 L6 12.5" />
                      </svg>
                    </span>
                  </div>
                  <span className="experience-dates-text">{job.dates}</span>
                </div>

                <div className="experience-row-bottom">
                  <span className="experience-role-text">{job.role}</span>
                  <span className="experience-location-text">{job.location}</span>
                </div>
              </button>

              <div
                id={`exp-content-${job.company.replace(/\s+/g, "-")}`}
                className={`experience-details-collapse ${isOpen ? "open" : ""}`}
              >
                <div className="experience-details-inner">
                  <h4 className="experience-done-heading">What I&apos;ve done</h4>
                  <ul className="experience-points-list">
                    {job.points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
