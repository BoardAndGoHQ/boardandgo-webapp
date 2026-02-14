'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Briefcase, MapPin, ChevronDown, ArrowRight, Users, Globe, Zap,
  Clock, GraduationCap, Laptop, Heart, Coffee,
} from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

/* ── Job Card ── */
function JobCard({
  title, type, location, description, requirements, index,
}: {
  title: string; type: string; location: string; description: string; requirements: string[]; index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 animate-fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              {type}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {location}
            </span>
          </div>
        </div>
        <Link
          href="#"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-blue text-white text-sm font-semibold rounded-full hover:bg-accent-blue/90 transition-all hover:scale-105 shrink-0"
        >
          Apply Now
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <p className="text-sm text-text-secondary mb-4 leading-relaxed">{description}</p>

      <button onClick={() => setExpanded(!expanded)} className="group text-left">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-blue group-hover:text-accent-blue/80 transition-colors">
          Requirements
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
        </span>
      </button>

      <div
        className="grid transition-all duration-300"
        style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <ul className="space-y-2 mt-4">
            {requirements.map((r) => (
              <li key={r} className="flex items-start gap-2.5 text-sm text-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-2 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

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

const perks = [
  { icon: Globe, label: 'Remote-first environment' },
  { icon: Clock, label: 'Flexible working hours' },
  { icon: GraduationCap, label: 'Continuous learning' },
  { icon: Users, label: 'Regular team meetups' },
  { icon: Heart, label: 'Competitive compensation' },
  { icon: Laptop, label: 'Latest tech stack' },
];

export default function CareersPage() {
  const heroRef = useScrollReveal<HTMLDivElement>();
  const cultureRef = useScrollReveal<HTMLDivElement>();
  const positionsRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="flex flex-col">
      {/* ═══ Hero ═══ */}
      <section className="relative pt-20 md:pt-28 pb-16 overflow-hidden">
        <div className="absolute top-16 right-1/4 w-100 h-100 bg-accent-blue/5 rounded-full blur-3xl pointer-events-none animate-drift" />

        <div ref={heroRef} className="scroll-reveal max-w-6xl mx-auto px-5 text-center space-y-6">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs font-medium text-accent-blue">
            <Zap className="w-3.5 h-3.5" />
            We&apos;re Hiring
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary leading-tight">
            Join Our Mission
            <span className="gradient-text block mt-2">Shape the Future of Travel</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Help us build the next generation of AI-powered flight tracking technology. We&apos;re
            looking for passionate individuals who want to make air travel stress-free.
          </p>
        </div>
      </section>

      {/* ═══ Culture ═══ */}
      <section className="py-16 md:py-24 bg-bg-secondary/50">
        <div ref={cultureRef} className="scroll-reveal max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-4xl font-bold text-text-primary">
                Our Culture
                <span className="gradient-text block mt-1">Innovation &amp; Impact</span>
              </h2>
              <p className="text-text-secondary leading-relaxed">
                At BoardAndGo, we&apos;re building technology that makes a real difference in
                people&apos;s lives. Our team is remote-first, focused on innovation, and passionate
                about creating exceptional user experiences.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {perks.map((p, i) => (
                  <div
                    key={p.label}
                    className="glass rounded-xl p-3 flex items-center gap-3 animate-fade-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue shrink-0">
                      <p.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-text-secondary font-medium">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden glass-card">
              <Image src="/images/culture-visual.jpg" alt="BoardAndGo Culture" width={600} height={400} className="w-full h-auto" />
              <div className="absolute inset-0 bg-linear-to-tr from-accent-blue/10 via-transparent to-transparent mix-blend-overlay" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Open Positions ═══ */}
      <section className="py-16 md:py-24">
        <div ref={positionsRef} className="scroll-reveal max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent-blue/10 text-accent-blue mb-4">
              <Coffee className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
              Open Positions
            </h2>
            <p className="text-text-muted mt-2">Find your next role at BoardAndGo</p>
          </div>
          <div className="space-y-5">
            {openPositions.map((pos, i) => (
              <JobCard key={pos.title} {...pos} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
