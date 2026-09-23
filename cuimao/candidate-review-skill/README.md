# CuiMao candidate evidence review — independent demo

This Skill is an applicant-created sample, not CuiMao's approved hiring process. It helps a recruiter turn candidate-supplied resumes and professional work into a concise, source-linked brief. It does not collect applicants, contact them, or make hiring decisions.

## Try it

Download the [Skill ZIP](../candidate-review-skill.zip), unzip it, and make the `candidate-review-skill` folder available to your Agent as a Skill folder. An Agent that supports `SKILL.md` can then be asked:

> Use the candidate-evidence-review Skill. First show me the draft role profile and ask me to confirm the job competencies. Then review this candidate-supplied resume and these public links. Keep every conclusion tied to a source, flag uncertain identity matches, and produce one candidate card. Do not contact anyone or put applicant files in a public repository.

The demonstration card for [Mingze Ma](demo-bono.md) uses only his own application materials. For a real batch, keep resumes, extracted text, run IDs, review history, and contact details in the recruiter's private workspace. This repository contains no other applicants' data. A parser or storage service is not bundled: use existing authorised local tools first, and obtain permission before sending candidate files to a third-party service.

## What this borrows

- [ResumeHQ / Resume-Builder](https://github.com/jananthan30/Resume-Builder): map each requirement to an exact source excerpt; missing evidence stays unverified.
- [boss-hr-agent-toolkit](https://github.com/1xiaoyueryuer/boss-hr-agent-toolkit): keep each run and its artifacts distinct. Its scoring thresholds and automated greeting are not part of this Skill.
- [Iteration Layer Skills](https://github.com/iterationlayer/skills): structured extraction fields with source references. This Skill does not require its API.
- [rsc-harness](https://github.com/ericrisco/rsc-harness): define job competencies before reviewing applicants and use consistent interviews or work samples.

These are design references. No code or text from those projects is bundled here.
