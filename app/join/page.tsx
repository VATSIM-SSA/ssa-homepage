"use client";

import { useState } from "react";
import {
  ArrowRight,
  Ban,
  Check,
  ChevronDown,
  CircleCheck,
  Clock,
  Copy,
  ExternalLink,
  Globe,
  GraduationCap,
  Mail,
  Plane,
  Radio,
  TowerControl,
  TriangleAlert,
  UserCheck,
} from "lucide-react";
import { Header } from "@/components/ui/header";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";

const MEMBERSHIP_EMAIL = "membership@vatssa.com";
const MY_VATSIM_URL = "https://my.vatsim.net/";
const TVCP_URL =
  "https://vatsim.net/docs/policy/transfer-and-visiting-controller-policy";
const GCAP_URL =
  "https://vatsim.net/docs/policy/global-controller-administration-policy";
const POLICIES_URL = "https://vatssa.com/about/policies";
const TRAINING_URL = "https://cc.vatssa.com/";
const DISCORD_URL = "https://community.vatsim.net/";

const EMAIL_TEMPLATE = `Subject: Transfer request — [YOUR NAME] ([YOUR CID])

Hello VATSSA Membership,

I would like to request a [transfer to / visiting endorsement with] VATSSA.

CID: [1234567]
Full name: [Your name]
Current rating: [S1 / S2 / S3 / C1 / C3]
Current division: [e.g. VATSIM UK]
Current region: [EMEA]

Why I want to join VATSSA:
[A few sentences. This is read by the Membership department, so tell us what
you want to control and why VATSSA.]

I confirm that:
- I do not hold a staff position elsewhere that conflicts with membership here.
- I have no open training request in another division.
- I have read and agree to the VATSSA Membership Policy.

Thank you,
[Your name]`;

const ratingCourses = [
  {
    rating: "S1",
    title: "Student 1",
    body: "You will be required to apply for S1 familiarisation training. This includes the S1 theory course, which is hosted on our training platform, mentor training, and a checkout hosted on Sweatbox.",
    assessment: "Checkout on Sweatbox",
  },
  {
    rating: "S2",
    title: "Student 2",
    body: "You will be required to apply for S2 familiarisation training. This includes the S2 theory course, which is hosted on our training platform, mentor training, and a final exam hosted on either Sweatbox or the live network.",
    assessment: "Final exam — Sweatbox or live",
  },
  {
    rating: "S3",
    title: "Student 3",
    body: "You will be required to apply for S3 familiarisation training. This includes the S3 theory course, which is hosted on our training platform, mentor training, and a final exam hosted on either Sweatbox or the live network.",
    assessment: "Final exam — Sweatbox or live",
  },
  {
    rating: "C1",
    title: "Controller 1",
    body: "You will be required to apply for C1 familiarisation training. This includes the C1 theory course, which is hosted on our training platform, mentor training, and a final exam hosted on either Sweatbox or the live network.",
    assessment: "Final exam — Sweatbox or live",
  },
];

const faqs = [
  {
    question: "I hold S1 or S2 and I want to visit VATSSA.",
    answer:
      "Visiting is not open to you. Under the VATSIM Transfer & Visiting Controller Policy, visiting applications are only accepted from controllers rated S3 or above, and VATSSA does not accept S1 or S2 visiting applications. Your options are to transfer to VATSSA as your home division, or to keep controlling at home until you reach S3.",
  },
  {
    question: "I am an Observer with no ATC rating.",
    answer:
      "The 50-hour and 90-day restrictions do not apply to you. TVCP 2.2 lets account holders without an ATC rating transfer freely, so email Membership and we will action it. You then start training with us from S1.",
  },
  {
    question: "I have just registered with VATSIM.",
    answer:
      "Set VATSSA directly on myVATSIM as your initial region and division placement. The 90-day transfer wait applies only after using the Change Region procedure, not to the placement you make when you first register — so there is nothing to send us and no request to wait on.",
  },
  {
    question: "I used to be a VATSSA member and want to come back.",
    answer:
      "You use the standard transfer process, with no shortcuts. Your previous record with us stays linked to your CID and is visible to Membership staff, so tell us in your email that you are returning.",
  },
  {
    question: "I hold a staff position in another division.",
    answer:
      "Declare it in your email. A position that conflicts with holding VATSSA as your home division has to be resolved before a transfer can complete, so tell us up front rather than after the fact.",
  },
  {
    question: "I am already a VATSSA home controller.",
    answer:
      "Nothing to do here. Head to the Control Centre to register for training or request an endorsement.",
  },
  {
    question: "I am visiting and want to stop.",
    answer:
      "Email Membership and ask us to withdraw your visiting endorsement. It is logged and you are free to apply again later.",
  },
  {
    question: "How long does a request take?",
    answer:
      "There is no fixed turnaround. Requests are worked by hand by the Membership department, so it depends on how many are in front of yours. If you have heard nothing after a week, reply to your own email to bump it.",
  },
  {
    question: "My request was declined. What now?",
    answer:
      "You are always told by email. Under TVCP 5.4 a request can only be declined on three grounds: you do not meet the requirements, you have disciplinary history within the last year, or you have not met a published currency-hours requirement. The email tells you which, and you may appeal.",
  },
];

function RouteCard({
  badge,
  icon,
  question,
  verdict,
  detail,
  action,
  tone,
}: {
  badge: string;
  icon: React.ReactNode;
  question: string;
  verdict: string;
  detail: string;
  action: React.ReactNode;
  tone: "primary" | "secondary" | "muted";
}) {
  const toneRing = {
    primary: "border-primary/40",
    secondary: "border-secondary/40",
    muted: "border-zinc-700",
  }[tone];

  const toneText = {
    primary: "text-primary",
    secondary: "text-secondary",
    muted: "text-zinc-300",
  }[tone];

  return (
    <div
      className={`flex h-full flex-col gap-4 rounded-3xl border bg-zinc-800/70 p-7 text-left ${toneRing}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 ${toneText}`}
        >
          {icon}
        </span>
        <span className="rounded-full bg-zinc-950 px-3 py-1 font-mono text-xs uppercase tracking-widest text-zinc-400">
          {badge}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          {question}
        </p>
        <h3 className={`text-xl font-semibold ${toneText}`}>{verdict}</h3>
      </div>

      <p className="flex-1 text-sm leading-6 text-zinc-300">{detail}</p>

      <div className="pt-1">{action}</div>
    </div>
  );
}

function Requirement({
  label,
  detail,
  blocked = false,
}: {
  label: string;
  detail: string;
  blocked?: boolean;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          blocked ? "bg-red-500/15 text-red-400" : "bg-secondary/15 text-secondary"
        }`}
      >
        {blocked ? (
          <Ban className="h-3.5 w-3.5" />
        ) : (
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        )}
      </span>
      <span className="text-sm leading-6 text-zinc-300">
        <strong className="font-semibold text-white">{label}</strong> — {detail}
      </span>
    </li>
  );
}

function TimelineStep({
  step,
  title,
  children,
  last = false,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <li className="relative flex gap-5 pb-8 last:pb-0">
      {!last ? (
        <span
          className="absolute top-11 bottom-1 left-[19px] w-px bg-zinc-700"
          aria-hidden="true"
        />
      ) : null}
      <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-zinc-950 font-mono text-sm font-bold text-primary">
        {step}
      </span>
      <div className="flex flex-col gap-1 pt-1.5">
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm leading-6 text-zinc-300">{children}</p>
      </div>
    </li>
  );
}

function Faq({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl bg-zinc-800">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-zinc-700/50"
      >
        <span className="font-semibold text-white">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-primary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen ? (
        <p className="px-6 pb-5 text-sm leading-6 text-zinc-300">{answer}</p>
      ) : null}
    </div>
  );
}

export default function Join() {
  const [hasCopied, setHasCopied] = useState(false);

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(EMAIL_TEMPLATE);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2500);
    } catch {
      setHasCopied(false);
    }
  }

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center overflow-hidden bg-zinc-950 px-4">
      <Image
        src="/images/south-african-a340.webp"
        alt="Hero Banner"
        className="absolute top-0 left-0 h-[60vh] w-full object-cover"
      />

      <div className="absolute inset-0 h-[60vh] bg-gradient-to-b from-zinc-950/30 via-zinc-950/45 to-zinc-950" />

      <section className="relative z-10 flex h-[60vh] w-full max-w-7xl flex-col items-center justify-center px-6 pt-[104px] text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-secondary">
          Transfer &amp; Visiting
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          Join VATSSA.
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-200 sm:text-lg">
          Membership in VATSSA is open to any member of the VATSIM Europe, Middle
          East and Africa Region, in accordance with the VATSIM Transfer &amp;
          Visiting Controller Policy and VATSSA&apos;s Membership Policy.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="filled" href="#apply">
            How to apply <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" href="#requirements">
            Check the requirements
          </Button>
        </div>
      </section>

      {/* ---- Which route is yours ---- */}
      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-8 px-6 py-16">
        <Header text="Start Here" />

        <p className="mx-auto max-w-3xl text-center text-base leading-7 text-zinc-200">
          Where your request goes depends on one thing: which VATSIM{" "}
          <strong className="text-white">region</strong> you are in right now.
          Find yourself below before you write to anybody.
        </p>

        <div className="grid gap-5 lg:grid-cols-3">
          <RouteCard
            badge="Route A"
            tone="muted"
            icon={<Globe className="h-5 w-5" />}
            question="My region is not EMEA"
            verdict="Do it on myVATSIM"
            detail="VATSSA is a division inside the VATSIM Europe, Middle East and Africa Region. Moving in from another region is a region transfer, and that is requested and completed entirely on myVATSIM. There is nothing to send us, and nothing further to do here once it goes through."
            action={
              <Button
                variant="outline"
                href={MY_VATSIM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                Go to myVATSIM <ExternalLink className="h-4 w-4" />
              </Button>
            }
          />

          <RouteCard
            badge="Route B"
            tone="muted"
            icon={<Plane className="h-5 w-5" />}
            question="I just registered with VATSIM"
            verdict="Also myVATSIM"
            detail="The 90-day transfer wait applies only after using the Change Region procedure — not to the placement you make when you first register. So if you are brand new, set VATSSA as your region and division directly on myVATSIM. No request, no queue, no waiting period."
            action={
              <Button
                variant="outline"
                href={MY_VATSIM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                Go to myVATSIM <ExternalLink className="h-4 w-4" />
              </Button>
            }
          />

          <RouteCard
            badge="Route C"
            tone="primary"
            icon={<Mail className="h-5 w-5" />}
            question="I am already in the EMEA region"
            verdict="Email Membership"
            detail="You are in the right region, so this is a division transfer and we handle it. Send one email to the Membership department with your details and your reason for joining. Visiting endorsements go to the same address. Everything runs through email — there is no form and no help-desk ticket to open."
            action={
              <Button
                variant="filled"
                href={`mailto:${MEMBERSHIP_EMAIL}`}
                className="w-full"
              >
                <Mail className="h-4 w-4" /> {MEMBERSHIP_EMAIL}
              </Button>
            }
          />
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-zinc-700 bg-zinc-800/40 p-6">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <p className="text-sm leading-6 text-zinc-300">
            Not sure which region you are in? Sign in to{" "}
            <a
              href={MY_VATSIM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              myVATSIM
            </a>{" "}
            and look at your profile. Your region is listed above your division.
            If it does not say Europe, Middle East and Africa, you are on Route
            A.
          </p>
        </div>
      </section>

      {/* ---- Transfer vs visiting ---- */}
      <section
        id="requirements"
        className="relative z-10 flex w-full max-w-7xl scroll-mt-28 flex-col gap-8 px-6 py-16"
      >
        <Header text="Transfer Or Visit" />

        <p className="mx-auto max-w-3xl text-center text-base leading-7 text-zinc-200">
          Two different things, two different sets of requirements. Transferring
          makes VATSSA your <strong className="text-white">home</strong>{" "}
          division. Visiting keeps your home where it is and adds VATSSA
          alongside it.
        </p>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Transfer */}
          <div className="flex flex-col gap-5 rounded-3xl bg-zinc-800 p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                <UserCheck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-2xl font-semibold text-white">Transfer</h2>
                <p className="text-sm text-zinc-400">
                  VATSSA becomes your home division
                </p>
              </div>
            </div>

            <p className="text-sm leading-6 text-zinc-300">
              Open to any rating, including Observer. What we check comes from
              the VATSIM Transfer &amp; Visiting Controller Policy, not from
              local preference.
            </p>

            <ul className="flex flex-col gap-3">
              <Requirement
                label="EMEA region"
                detail="you are already in the Europe, Middle East and Africa Region (otherwise Route A above)."
              />
              <Requirement
                label="50 hours at your rating"
                detail="TVCP 4.2 — at least 50 hours on positions requiring your current rating, in your home allocation. Observers with no ATC rating are exempt (TVCP 2.2)."
              />
              <Requirement
                label="90 days since your last upgrade"
                detail="your most recent rating change was at least 90 days ago."
              />
              <Requirement
                label="90 days since your last transfer"
                detail="if you have never transferred before, this one is automatically satisfied."
              />
              <Requirement
                label="No disciplinary history in the last year"
                detail="checked against your VATSIM record and ours. Only the last 12 months count."
              />
              <Requirement
                label="No conflicting staff position"
                detail="you declare in your email that no staff role you hold elsewhere conflicts with membership here."
              />
            </ul>

            <div className="mt-auto flex items-start gap-3 rounded-2xl bg-zinc-950/60 p-4">
              <Plane className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <p className="text-sm leading-6 text-zinc-300">
                <strong className="text-white">You keep your rating.</strong>{" "}
                Transferring does not reset you to Observer. You arrive holding
                the rating you already have, and familiarise with our airspace at
                that level.
              </p>
            </div>
          </div>

          {/* Visiting */}
          <div className="flex flex-col gap-5 rounded-3xl bg-zinc-800 p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <TowerControl className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-2xl font-semibold text-white">Visiting</h2>
                <p className="text-sm text-zinc-400">
                  Your home stays where it is
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-red-500/10 p-4">
              <Ban className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="text-sm leading-6 text-zinc-200">
                <strong className="text-white">S3 and above only.</strong>{" "}
                VATSSA does not accept visiting applications from S1 or S2 rated
                controllers, in accordance with the VATSIM Transfer &amp;
                Visiting Controller Policy.
              </p>
            </div>

            <ul className="flex flex-col gap-3">
              <Requirement
                label="Rated S3 or above"
                detail="TVCP 6.1 — S1 and S2 controllers cannot apply."
                blocked={false}
              />
              <Requirement
                label="Current in your home allocation"
                detail="TVCP 6.1(b) — at least 50 hours on positions requiring your current rating at home."
              />
              <Requirement
                label="At least half your controlling stays at home"
                detail="you keep 50% or more of your controlling in your home division, and commit to keeping it that way."
              />
              <Requirement
                label="No open training request elsewhere"
                detail="you declare that you are not mid-training in another division."
              />
              <Requirement
                label="No disciplinary history in the last year"
                detail="same 12-month look-back as a transfer."
              />
            </ul>

            <div className="flex items-start gap-3 rounded-2xl bg-zinc-950/60 p-4">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm leading-6 text-zinc-300">
                <strong className="text-white">Staying current.</strong> Once
                you hold a visiting endorsement we expect you to keep at least
                50% of your controlling at home and put in at least 10 hours a
                year in VATSSA airspace. Fall short and a staff member will talk
                to you before anything is withdrawn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Familiarisation training ---- */}
      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-8 px-6 py-16">
        <Header text="Familiarisation Training" />

        <p className="mx-auto max-w-3xl text-center text-base leading-7 text-zinc-200">
          Arriving with a rating does not put you straight on a position. You
          familiarise with our airspace and procedures at the rating you already
          hold, and you keep that rating throughout — this is not retraining
          from scratch.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {ratingCourses.map((course) => (
            <div
              key={course.rating}
              className="flex flex-col gap-4 rounded-3xl bg-zinc-800 p-7"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 font-mono text-base font-bold text-primary">
                  {course.rating}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {course.title}
                  </h3>
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                    {course.assessment}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-6 text-zinc-300">{course.body}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-3xl bg-zinc-800/60 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
            <p className="text-sm leading-6 text-zinc-300">
              Theory courses sit on our training platform, mentor sessions are
              booked through the Control Centre, and Sweatbox checkouts are run
              by our mentors and examiners.
            </p>
          </div>
          <Button
            variant="outline"
            href={TRAINING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            Control Centre <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* ---- How to apply ---- */}
      <section
        id="apply"
        className="relative z-10 flex w-full max-w-7xl scroll-mt-28 flex-col gap-8 px-6 py-16"
      >
        <Header text="Applying By Email" />

        <p className="mx-auto max-w-3xl text-center text-base leading-7 text-zinc-200">
          If you are already in the EMEA region, everything happens by email. One
          message to{" "}
          <a
            href={`mailto:${MEMBERSHIP_EMAIL}`}
            className="text-primary underline hover:text-primary/80"
          >
            {MEMBERSHIP_EMAIL}
          </a>{" "}
          starts your request. Copy the template, fill in the brackets, send it.
        </p>

        <div className="grid gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-zinc-900">
              <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-6 py-4">
                <span className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
                  <Mail className="h-4 w-4 text-primary" /> Email template
                </span>
                <button
                  type="button"
                  onClick={copyTemplate}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary px-4 py-1.5 text-xs font-semibold text-primary transition-colors duration-200 hover:bg-primary hover:text-zinc-950"
                >
                  {hasCopied ? (
                    <>
                      <CircleCheck className="h-3.5 w-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="scrollbar overflow-x-auto px-6 py-5 font-mono text-xs leading-6 whitespace-pre-wrap text-zinc-300">
                {EMAIL_TEMPLATE}
              </pre>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="flex flex-col gap-3 rounded-3xl bg-zinc-800 p-7">
              <h3 className="font-semibold text-white">
                What makes a good email
              </h3>
              <ul className="flex flex-col gap-2 text-sm leading-6 text-zinc-300">
                <li>
                  <strong className="text-white">Your CID, always.</strong>{" "}
                  Everything we check hangs off it.
                </li>
                <li>
                  <strong className="text-white">Say which one.</strong>{" "}
                  Transfer or visiting — they are different requests.
                </li>
                <li>
                  <strong className="text-white">Give us a reason.</strong> A
                  real one, in your own words. Membership staff read it.
                </li>
                <li>
                  <strong className="text-white">One request at a time.</strong>{" "}
                  Do not send a transfer and a visiting request together.
                </li>
                <li>
                  <strong className="text-white">Use one thread.</strong> Reply
                  to your own email rather than sending a new one.
                </li>
              </ul>
            </div>

            <div className="flex items-start gap-3 rounded-3xl border border-zinc-700 bg-zinc-800/40 p-7">
              <Radio className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
              <p className="text-sm leading-6 text-zinc-300">
                Questions before you apply are welcome in our Discord. The
                request itself still has to come by email so it can be recorded
                and tracked properly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- What happens next ---- */}
      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-8 px-6 py-16">
        <Header text="What Happens Next" />

        <p className="mx-auto max-w-3xl text-center text-base leading-7 text-zinc-200">
          No black box. This is exactly what your email goes through, and who
          does what.
        </p>

        <div className="grid gap-5 lg:grid-cols-2">
          <ol className="flex flex-col rounded-3xl bg-zinc-800 p-8">
            <TimelineStep step={1} title="We receive your email">
              It lands with the Membership department. Nothing is automated at
              this stage, so you will not get an instant reply.
            </TimelineStep>
            <TimelineStep step={2} title="A staff member picks it up">
              One person takes ownership of your request and works it through to
              a decision, so you are dealing with the same staffer throughout.
            </TimelineStep>
            <TimelineStep step={3} title="We check you against the policy">
              Your rating, hours, dates and record are checked against the
              requirements above, and your disciplinary record is reviewed. Every
              check is logged with who did it and when.
            </TimelineStep>
            <TimelineStep step={4} title="The change is made on VATSIM">
              Approvals are actioned on the VATSIM Terminal — VATSIM&apos;s own
              system is where your division or endorsement actually changes. We
              record what we did there.
            </TimelineStep>
            <TimelineStep step={5} title="You hear back, either way" last>
              You are emailed the outcome. A decline always comes with the reason
              and your right to appeal. An approval tells you what to do next.
            </TimelineStep>
          </ol>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 rounded-3xl bg-zinc-800 p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <h3 className="text-xl font-semibold text-white">
                  After a transfer is approved
                </h3>
              </div>
              <p className="text-sm leading-6 text-zinc-300">
                A transfer is not finished the moment it is approved. You go
                through an induction with us, and then apply for familiarisation
                training at your rating. Leave the induction undone for 90 days
                and the transfer can be voided, so book it early.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-3xl bg-zinc-800 p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <Clock className="h-5 w-5" />
                </span>
                <h3 className="text-xl font-semibold text-white">
                  Why it is email for now
                </h3>
              </div>
              <p className="text-sm leading-6 text-zinc-300">
                Membership requests are handled by hand today: read, checked and
                actioned by a staff member. It works, but it gives you no way to
                see where your request is. A self-service Membership Portal is in
                development, where you will sign in with VATSIM, see whether you
                are eligible before you apply, and track your request through
                each stage. Until it is live, email is the route.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Odd cases ---- */}
      <section className="relative z-10 flex w-full max-w-7xl flex-col gap-6 px-6 py-16">
        <Header text="Odd Cases" />

        <p className="mx-auto max-w-3xl text-center text-base leading-7 text-zinc-200">
          The situations we get asked about most.
        </p>

        <div className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <Faq key={faq.question} {...faq} />
          ))}
        </div>
      </section>

      {/* ---- Closing ---- */}
      <section className="relative z-10 flex w-full max-w-7xl flex-col items-center gap-6 px-6 py-16 pb-24 text-center">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
          The African skies are open.
        </h2>
        <p className="max-w-2xl text-base leading-7 text-zinc-300">
          Read the policies if you want the full detail, then send us that email.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="filled" href={`mailto:${MEMBERSHIP_EMAIL}`}>
            <Mail className="h-4 w-4" /> Email Membership
          </Button>
          <Button variant="outline" href={POLICIES_URL}>
            VATSSA Policies
          </Button>
          <Button
            variant="outline"
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-zinc-500">
          <a
            href={TVCP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zinc-300"
          >
            VATSIM Transfer &amp; Visiting Controller Policy
          </a>
          <a
            href={GCAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zinc-300"
          >
            VATSIM Global Controller Administration Policy
          </a>
        </p>
      </section>
    </div>
  );
}
