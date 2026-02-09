'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const JobCard = ({
  title,
  type,
  location,
  description,
  requirements,
}: {
  title: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-effect rounded-2xl p-6 hover:scale-[1.01] transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <div className="flex items-center gap-3 mt-1.5 text-sm text-text-muted">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {type}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {location}
            </span>
          </div>
        </div>
        <Link
          href="#"
          className="px-4 py-2 bg-accent-teal text-bg-primary text-sm font-medium rounded-full hover:bg-accent-teal/90 transition-colors"
        >
          Apply Now
        </Link>
      </div>
      <p className="text-sm text-text-muted mb-4">{description}</p>
      <button onClick={() => setExpanded(!expanded)} className="text-left group">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
          Requirements
          <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'mt-4 max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <ul className="space-y-2">
          {requirements.map((r) => (
            <li key={r} className="flex items-start gap-2 text-sm text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-teal mt-1.5 shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const openPositions = [
  {
    title: 'Senior Frontend Developer (Next.js)',
    type: 'Full-time',
    location: 'Remote',
    description: 'Join our frontend team to build beautiful, responsive user interfaces for our flight tracking platform.',
    requirements: ['5+ years of experience with React and Next.js', 'Strong TypeScript skills', 'Experience with Tailwind CSS', 'Understanding of web performance optimization', 'Experience with real-time data visualization'],
  },
  {
    title: 'Senior AI Engineer (LangChain/LangGraph)',
    type: 'Full-time',
    location: 'Remote',
    description: 'Help build and optimize our AI agents that power proactive flight monitoring and passenger assistance.',
    requirements: ['5+ years of experience in ML/AI engineering', 'Strong expertise in LangChain and LangGraph', 'Experience building production-grade LLM applications', 'Proficiency in Python and async programming', 'Understanding of RAG', 'Experience with vector databases', 'Knowledge of prompt engineering and LLM fine-tuning'],
  },
  {
    title: 'Senior Backend Engineer (Python/FastAPI)',
    type: 'Full-time',
    location: 'Remote',
    description: 'Design and build scalable microservices architecture for our flight tracking platform using Python and FastAPI.',
    requirements: ['5+ years of experience in backend development with Python', 'Strong expertise in FastAPI and async programming', 'Experience building and maintaining microservices architecture', 'Proficiency in SQL and NoSQL databases', 'Experience with message queues (RabbitMQ, Redis)', 'AWS experience is a plus'],
  },
];

export default function CareersPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative pt-16 md:pt-24 pb-12 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-teal/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">
            Join Our Mission
            <span className="gradient-text block mt-2">Shape the Future of Travel</span>
          </h1>
          <p className="text-lg text-text-muted max-w-3xl mx-auto">
            Help us build the next generation of AI-powered flight tracking technology. We&apos;re
            looking for passionate individuals who want to make air travel stress-free.
          </p>
        </div>
      </section>

      {/* Culture */}
      <section className="py-12 md:py-16 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
                Our Culture
                <span className="gradient-text block mt-2">Innovation &amp; Impact</span>
              </h2>
              <p className="text-text-muted">
                At BoardAndGo, we&apos;re building technology that makes a real difference in
                people&apos;s lives. Our team is remote-first, focused on innovation, and passionate
                about creating exceptional user experiences.
              </p>
              <div className="space-y-3">
                {['Remote-first environment', 'Flexible working hours', 'Continuous learning opportunities', 'Regular team meetups', 'Competitive compensation', 'Latest tech stack'].map((p) => (
                  <div key={p} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-teal" />
                    <span className="text-sm text-text-secondary">{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden">
              <Image src="/images/culture-visual.jpg" alt="BoardAndGo Culture" width={600} height={400} className="w-full h-auto" />
              <div className="absolute inset-0 bg-linear-to-tr from-accent-teal/10 via-transparent to-transparent mix-blend-overlay" />
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-12 md:py-16 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
              Open Positions
              <span className="gradient-text block mt-2">Join Our Team</span>
            </h2>
          </div>
          <div className="space-y-6">
            {openPositions.map((pos) => (
              <JobCard key={pos.title} {...pos} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
