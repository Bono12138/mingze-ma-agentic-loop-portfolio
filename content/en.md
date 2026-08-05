# From Copilot to the Agentic Loop: Delivering AI Tools and Building the Supporting Infrastructure

Mingze Ma · 马铭泽 · 馬銘澤

## Professional background

My work sits at the intersection of financial risk, systems, data and process. At EY Financial Services Technology Risk, I worked on ITGC, ITAC, and system and data control reviews for banking, insurance and securities engagements. My current role at Akulaku Group covers ECL and operational risk management. The ECL work includes methodology, data processing, system requirements, UAT, finance reconciliation, model updates and support for external review. The operational risk work requires continued review of business processes and their controls.

I first used AI for specific tasks: generating a code fragment or drafting a query. It later became involved in model work, data processing, audit responses and tool development. As the task chain grew, I started paying more attention to how business context was retained, how tools handed work to one another, and whether a problem found in one run would improve the next.

My way of working with AI has changed several times. In 2023, I mainly used browser-based AI tools to generate code fragments for automation and query scripts. I then moved to AI-enabled IDEs such as Cursor, Antigravity and Trae, where AI worked as a copilot during development. From 2025, agents including Claude Code, Cursor CLI, Codex and Hermes began taking on longer tasks across model and tool development, automated workflows, research and documentation.

In 2026, I shifted more of my attention to agentic engineering and to building a loop that could continue across tasks. Drawing on accumulated business and data knowledge, together with my control and process-review experience, I decoupled and restructured existing tools and automations, redesigned their interaction and presentation, and opened selected capabilities in stages according to internal security requirements and real business needs. The projects below trace that move from Copilot to an Agentic Loop inside an existing organisation.

## 1. From generating code to supporting an ECL update

When I first used ChatGPT, I would give it a narrowly defined request: merge Excel files, process a Word table, collect public information, or write a data-processing script. It produced code; I copied it, ran it, returned the error and tried again. This reduced coding time, but the tool could not see the whole project or check whether upstream and downstream files remained consistent.

The unit of work expanded once Cursor, Claude Code and Codex could operate inside a repository. The 30 June 2026 Group ECL update is my most complete example so far. It covers four lending portfolios in Indonesia and the Philippines: Indonesia BNPL, Indonesia Cash, Philippines BNPL and Indonesia productive lending. The work begins with finance scope and EAD reconciliation, then proceeds through order-level data construction, PD, LGD, EAD, staging, forward-looking adjustment, Group ECL aggregation, result analysis, methodology documentation and responses to prior audit questions.

There is no single platform that runs the project from start to finish. Data comes from Superset/Hive and finance files. FY25 reviewed models provide the methodology baseline. Some data processing must run on a server. Python and notebooks handle calculation and presentation. Excel is used for reading, review and management reporting. Git retains code, rules and versions. Generating SQL is only one step in a chain that moves across all of these environments.

I confirm the reporting-date population, methodology changes, data definitions, material operations and final acceptance. Agents perform much of the continuous execution: locating tables and fields, preparing and running SQL, resolving resource errors, constructing intermediate datasets, preparing model inputs, running models, comparing historical results, building workbooks and assembling review materials. Changes to existing table structures, deletion, and writes whose outcome is uncertain still require my confirmation of the exact target before execution continues.

The project is designed to be reviewable. Each formal query retains its SQL, query identifier, execution time, row count, result file and file hash. Model inputs are frozen. A database write is followed immediately by control checks. A client timeout triggers a target-state check before any rerun. Formal notebooks, Group results, methodology documents and audit responses for all four portfolios must be reproducible from the same set of inputs.

This was the first time I managed agents as continuing executors rather than code assistants. The unit of work grew from one function to a complete sequence: once scope is confirmed, continue through data retrieval, calculation, control checks and delivery.

*Related artefacts: project control file, data-construction SQL, portfolio notebooks, Group results, analytical workbooks, methodology documentation, responses to prior audit questions and automated acceptance checks.*

## 2. Audit-response architecture: a repeatable issue-resolution pipeline

This architecture pre-dates the 30 June project. During the FY25 ECL audit response from March to May 2026, I found that one audit question could affect methodology, code, data, explanatory documents and the final package at the same time. If an agent started editing as soon as it received a question, investigation, judgement, implementation and review would blur together. Fixing one point could create a new inconsistency elsewhere.

I redesigned the audit-response architecture around four linked stages that cannot substitute for one another:

```text
Investigate: verify the question in read-only mode and distinguish a real defect,
             a methodology question and an evidence gap
      ↓
Decide:      develop options, assess methodological and computational impact,
             and obtain my decision on the treatment
      ↓
Implement:   preserve the pre-change baseline, update code and documents,
             and rerun the affected calculations
      ↓
Final review: independently review methodology, code, notebooks, response
              and delivery results
      ↺ A failed review returns to implementation and is reviewed again
```

Each stage has its own inputs, permitted actions, required evidence and exit conditions. The investigation stage cannot quietly edit code, and “fixed” is not a substitute for a judgement on the issue. Method choices and material consequences remain human decisions. These boundaries are embedded in repository rules, scripts, tests and status files rather than left inside a single prompt.

The architecture also reflects what I call the pipeline theory. The agent is an execution node; task context, data, methods, permissions, verification and feedback form the surrounding pipeline. Problems found in operation strengthen that pipeline. A missing pre-change baseline becomes a mandatory comparison. State contamination between models leads to isolated execution. A notebook that appears to calculate but does not use the calculated value leads to dependency-chain checks and perturbation testing.

Question identifiers, processing windows and queuing rules were added later to preserve state, support parallel work and handle interruptions. They were operational improvements to the architecture, not its starting point. The 30 June project reused the same approach to task state, baselines, reruns, reconciliation and acceptance.

*Related artefacts: overall audit-response architecture, supporting SOPs, execution rules and control scripts, baseline and impact comparisons, pseudo-computation tests, independent final review and a visual workflow.*

## 3. Extracting a reusable Superset query tool from the ECL work

ECL updates and asset-quality analysis repeatedly require table discovery, SQL preparation, query execution, error handling and result retention. Agents could already help interpret a question and prepare SQL, but a person still had to copy it into Superset. Execution status and query results did not naturally flow back into the next analytical step, so the same capability remained scattered across projects.

I extracted query execution from the ECL workflow and developed `query-superset`. The agent interprets the business question and prepares SQL. The tool uses the employee’s existing Superset identity and permissions to execute read-only queries, then returns errors, results and run records to the agent. The design continues to use the company’s approved data-access channel; it does not create a separate direct database connection for automation.

I handled requirements, architecture, security boundaries, scripting, tests and installation. The result was packaged as a reusable Skill for different agent projects, with internal guidance covering sign-in, query execution, common errors, result retention and capability boundaries.

This was the first time I extracted an atomic capability from a complete business project. The agent could now do more than “write SQL”: it could complete the query and continue with the returned result. The tool was later made available internally through the company Wiki and an installation package.

*Related artefacts: the `query-superset` Skill, Windows query client, tests, installation package, user guide and capability-boundary documentation.*

## 4. From internal use to a higher level of architecture

Colleagues in several departments began using the released tool in their own work. The internal Wiki and supporting material explained installation and operation, as well as the appropriate scope, the controls already provided by the company, and the points at which a user should stop.

As use widened, questions quickly moved beyond “how do I retrieve the data?” to data cleaning, analysis, business knowledge and delivery. The query tool solved access to data. It could not decide an analytical definition, select an investigation method or explain a result. Adding more query features would not resolve those problems.

I therefore revisited the relationship between data retrieval, data analysis and business judgement. Execution tools, analytical methods and factual sources were separated. That step moved the work to a more abstract architectural level and led to the direction I initially called the “large infrastructure” project.

## 5. The Bono Agent capability and knowledge foundation

In July 2026, I reorganised the earlier work as an internal project formally called the Bono Agent Capability and Knowledge Foundation. It no longer extended one tool. It separated the different elements an agent needs to complete a business task.

The resulting architecture has four layers:

```text
Task layer:       the live business task, with its subject, period, reader
                  and completion conditions fixed
Method layer:     how data is prepared, anomalies are investigated,
                  and results are explained and delivered
Atomic capability layer:
                  bounded tools for databases, Wiki, files, browser and Excel
Evidence layer:   business knowledge, data dictionaries, source files,
                  query results and run records
```

### Task layer: business work remains within its project

The task layer currently carries Group ECL, PD assessment and monthly forecasting work. Each project retains its own entry point, `AGENTS.md`, project control file and handover state. Changing task information is not copied into the general plugin. `insight-router` provides a common entry point: it first fixes the original question, subject, period, population, reader, output and risks, then selects the shortest complete route through the required capabilities.

Each use receives a `usage_id` that ties together the Skills actually called, the result and subsequent feedback. At closeout, the Router treats project state, method or tool defects, and knowledge candidates separately. Improving a Skill or logging feedback cannot be mistaken for completing the original business task. One of the next tests is whether a new user can complete a task from the project entry point and existing instructions without my continuous explanation.

### Method layer: recurring working methods become Skills

The method layer now contains a connected set of capabilities. `prepare-analysis-data` defines population, period, grain, keys, mapping, control totals and data snapshots. `investigate-data-change` handles anomaly and trend investigation, positive and negative branches, competing explanations and stopping conditions. `deliver-analysis` turns verified results into an explanation a business reader can use. `deliver-workbook` defines the reading order, numeric meaning, evidence entry points and acceptance checks for Excel deliverables. `insight-router` handles cross-layer routing and task closeout.

These Skills are more than prompts. Each includes reference methods, task templates and completion criteria. Change investigation also has a separate depth validator that checks whether the original question was preserved, both increases and decreases were covered, identified causes reconcile to the total change, and stopping is supported by evidence. Current work prioritises validation in ECL, PD assessment, asset-quality investigation and Excel delivery. Further Skills are added only when recurring business needs and the architecture support them.

### Atomic capability layer: reuse approved tools

The atomic layer performs bounded actions. Existing capabilities include Superset queries, company Wiki access, local files and browser operation, together with the native document and Excel capabilities of Codex. Bono Insight manages when to call them, what evidence to retain, and how to judge completion. Execution is delegated to the database, browser and Excel capabilities already available in the host environment.

For example, `query-superset` continues to use the company’s identity, permissions and query channel. `deliver-workbook` defines workbook structure and acceptance, while native Excel tooling creates, edits and recalculates the file. A real-time service is packaged as MCP only when cross-project reuse, permission design, maintenance cost and recovery requirements justify it.

### Evidence layer: maintain facts separately from methods

The evidence layer contains business-knowledge entry points, data dictionaries, source files, query results, run records, reader preferences and project evidence. Company business facts are not packaged into the distributable plugin. They remain in approved host projects and are read when needed through capabilities such as `business-knowledge`. An important item records not only what it is and where it is stored, but also the applicable entity, grain, effective period, source, current status and level of confirmation. This prevents an agent from treating an old definition as a current fact.

At the current scale, Git-managed structured text and source evidence provide workable version, provenance and effective-period control. A new fact first enters as a knowledge candidate. It becomes applied knowledge only after the authoritative entry is updated and verified. If team use and real-time demand grow, a vector database or long-running knowledge service can be assessed. Near-term work focuses on a clearer business-context interface and different retention rules for formal evidence, rebuildable cache and temporary output.

### How the layers connect

Calls normally move down from the task while evidence and state return upward. The Router fixes the task contract and selects methods. Methods call databases, Wiki, files or Excel capabilities approved by the host project. Results and sources enter the evidence layer. The workflow then returns to the original question for validation and delivery. The Workbench is the operating platform, `AGENTS.md` holds cross-layer safety and governance rules, and the Plugin is the installation and distribution form. They are not additional business layers.

A local feedback recorder sends capability defects and knowledge candidates into separate state flows. A public GitHub Issue can be created only from redacted content that has been manually reviewed. Repository tests check plugin structure, feedback state, public-content boundaries and investigation depth. This allows a correction made in one task to improve later work without allowing the agent to rewrite rules and publish them automatically.

### Returning to 0630: architecture in a live delivery

The architecture was not built outside the business and then introduced afterwards. The 0630 ECL update, supporting the Group’s IPO-related financial preparation, is its most complete live run to date. Superset querying, business knowledge, data-preparation methods, the audit-response pipeline and acceptance rules let agents move through data construction, model execution, cross-checks, anomaly investigation, result workbooks and methodology materials for four portfolios from one task entry point. Confirmed field meanings, methodology baselines, file locations and completion criteria do not have to be explained again in every conversation. Queries, model inputs, run results and review evidence remain on the same evidence chain. These capabilities are supporting the current full refresh of model data and results.

The 0630 project also exposed what remained rough in the architecture and directly shaped the task and method layers. Updating four portfolios together required tighter control of reporting date, population, portfolio scope, methodology version, material operations and acceptance state. Population reconciliation, date semantics, keys, mapping and snapshots became part of `prepare-analysis-data`. The need to explain both positive and negative movements rather than net change alone led `investigate-data-change` to add quantified attribution, competing explanations and stopping conditions. The requirement that notebooks, Group results and workbooks be reviewable by someone not involved in development further shaped `deliver-analysis` and `deliver-workbook`.

The same project continues to improve the evidence layer. Business definitions, sources, field limitations, reviewed methodologies, finance control totals, formal queries and run records for all four portfolios return to their authoritative locations with applicable periods and confirmation status. The result is a two-way loop: existing infrastructure reduces repeated searching and rework, while problems encountered in the project become new task controls, method changes or verified knowledge for the next run.

## 6. Bono Insight: packaging the methods as a plugin

After validation in the 0630 project and other live tasks, I organised the stable methods, templates, validation scripts and safety boundaries as Bono Insight. I did not package the whole Workbench, company knowledge or private data capabilities with it. The current release is an OpenAI/Codex Preview plugin. Support for other agent environments is planned as thin adapters around the same core methods rather than separate copies of the Skill content.

Bono Insight contains installable Skills, reference methods, validation scripts, safety guidance and a feedback mechanism. The release package is built from internal authoritative sources, and a Source Map records the relationship between internal methods and distributable content so that the two versions do not drift independently. The plugin is tested locally and through GitHub Actions, and can now be installed and called in Codex.

Plugin packaging gives the four-layer architecture a continuing feedback path. The Router opens a separate record for each use. At closeout, the Skills used, completion state, capability defects and new knowledge candidates enter a local feedback queue. Scheduled jobs consolidate these records and surface recurring defects, open tasks, knowledge awaiting verification and architectural questions that need review.

The queue does not edit the plugin by itself. A scope or acceptance problem returns to the task layer. Repeated data-preparation, investigation or delivery problems return to the relevant method Skill, reference or validator. Failures in query, Wiki, file or Excel operations return to the corresponding atomic capability. A new business fact remains a knowledge candidate until its source, applicable period and scope are verified. Formal changes still pass tests, version records and release. “Self-improvement” therefore has a defined boundary: the system captures and consolidates feedback; a person decides what should enter the formal version.

The release remains Preview. Before a stable release, the priority is new-machine installation, cold start by a non-author user, continuity across tasks, whether the Router chooses the shortest complete route, and upgrade, rollback, retention and clean-up. The scheduled review and human decision mechanism also needs continued evidence that it reduces recurring errors instead of accumulating maintenance work. Potential later directions include thin adapters for other agent platforms, more redacted examples and evaluations, and real-time services or MCP only when repeated demand supports them.

At this point, “AI infrastructure” has a concrete meaning in my work: separate the task, the method, the execution capability and the evidence so that an agent knows where to obtain facts, how to work, when to stop and who confirms the result.

## 7. Knowledge sharing and other rapid delivery cases

I also document working methods for other people. At the invitation of a friend working in finance at Vanke, I helped prepare internal material on the practical impact of AI on finance work. It follows a real asset-quality reporting workflow and shows how data retrieval, analysis, reporting and review connect. It also covers pseudo-computation, hallucinated citations, information security and human judgement. My friend delivered the session; I handled case design, research, structure and presentation production.

I use agents to turn smaller problems into working tools and websites:

- [BonoBox](https://github.com/Bono12138/bonobox) packages web, news and image search as an installable Python/MCP tool, with installation, testing, failure boundaries and a public release.
- [Quota Capsule](https://github.com/Bono12138/codex-quota-capsule) reads local Codex quota information, combines it with recent usage pace, and shows the expected weekly runway in the macOS menu bar.
- [World Cup Rank Room](https://worldcup-rank-room.pages.dev/) turns an internal World Cup activity into an accessible site for rankings, team comparison and AI-assisted questions, using a separate public dataset and deployment.

The projects differ in size, but the working pattern is similar: define the problem, usage boundary and acceptance conditions, then use agents to accelerate implementation, debugging, testing and release. Each project retains code, installation instructions, tests, failure handling, version history and guidance for the next user.

## 8. Where processes come from

I keep returning to one question through these projects and through my earlier work: if a process determines what I do every day, what shaped the process itself?

At EY, audit and control work trained me to trace a result backwards: where the data and evidence came from, whether a control actually operated, and who judged and remediated an exception. In my current ECL, operational risk and information-system risk work, I deal with model, data and system delivery while continuing to review responsibilities, hand-offs and controls. My interest in process did not begin with agents. It was already part of the job.

Processes are rarely designed once as a complete whole. Policy requirements, system constraints, organisational boundaries, prior incidents and individual experience all leave marks. Some arrangements remain necessary; others have simply not been reconsidered for a long time. An agent that accelerates the process without examining it will also amplify its existing weaknesses.

Google DeepMind co-founder and CEO Demis Hassabis described DeepMind’s founding mission as: “Solve intelligence, and then use it to solve everything else.” [1]

Hassabis was talking about building intelligence itself and then applying it to scientific and practical problems. My work deals with the second half of that statement: how an organisation can actually use intelligence to solve problems. Agents can already execute and reason, yet organisational processes, business knowledge, permissions and decision points are often implicit. Process is the interface through which intelligence enters an organisation. It determines what an agent can see and do, when it must stop, and who remains responsible for the outcome. I organise these elements into a pipeline an agent can enter and reproduce. Exceptions, failures and feedback from live runs then return to the task, method, tool or knowledge layer and change the pipeline.

In practice, I select current business problems with clear boundaries to test the important assumptions in a system design. I retain the overall architecture, interfaces and expansion path while turning capabilities proven in projects and real use into reusable tools and methods. Data access, segregation of duties, run records, stopping and rollback, and human confirmation are considered at the architecture stage. Whether the right implementation is a central platform, layered capabilities or another form depends on the organisation’s objectives, existing systems, risk appetite and resources.

[1] Demis Hassabis, “Demis Hassabis on AI, game theory, multimodality, and the nature of creativity,” *Possible*, 9 April 2025: <https://www.possible.fm/podcasts/demis/>

## Public links

- BonoBox: <https://github.com/Bono12138/bonobox>
- Quota Capsule: <https://github.com/Bono12138/codex-quota-capsule>
- World Cup Rank Room: <https://github.com/Bono12138/worldcup-rank-room>
- World Cup Rank Room live site: <https://worldcup-rank-room.pages.dev/>
