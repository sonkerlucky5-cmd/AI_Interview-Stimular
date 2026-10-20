import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import {
  getLearningPlansRequest,
  getLearningPlanRequest,
  createLearningPlanRequest,
  updateLearningPlanItemRequest,
  addLearningPlanItemRequest,
  deleteLearningPlanItemRequest,
  regenerateLearningPlanRequest,
  deleteLearningPlanRequest,
} from "../services/learningPlanService";
import { getApiErrorMessage } from "../services/api";

function LearningRoadmap() {
  const [searchParams] = useSearchParams();
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Generator Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [targetRole, setTargetRole] = useState(searchParams.get("role") || "");
  const [skillGapsInput, setSkillGapsInput] = useState(searchParams.get("gaps") || "");
  const [minutesPerDay, setMinutesPerDay] = useState(45);
  const [learningStyle, setLearningStyle] = useState("balanced");
  const [targetDate, setTargetDate] = useState("");
  const sourceInterviewId = searchParams.get("sourceInterviewId") || null;

  // Add Custom Task Modal state
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTopic, setNewTaskTopic] = useState("");
  const [newTaskAction, setNewTaskAction] = useState("");
  const [newTaskMinutes, setNewTaskMinutes] = useState(30);
  const [newTaskOutcome, setNewTaskOutcome] = useState("");
  const [newTaskStage, setNewTaskStage] = useState("Custom Tasks");

  // Load initial plans
  const fetchPlans = async (selectId = null) => {
    try {
      setIsLoading(true);
      const res = await getLearningPlansRequest();
      if (res.success && res.data) {
        setPlans(res.data);
        if (res.data.length > 0) {
          const toSelect = selectId || res.data[0].id;
          setSelectedPlanId(toSelect);
          await loadPlanDetails(toSelect);
        } else {
          setActivePlan(null);
          // If came with query params, auto-open creator
          if (searchParams.get("role") || searchParams.get("gaps")) {
            setShowCreateModal(true);
          }
        }
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to load learning roadmaps."));
    } finally {
      setIsLoading(false);
    }
  };

  const loadPlanDetails = async (planId) => {
    try {
      setIsPlanLoading(true);
      const res = await getLearningPlanRequest(planId);
      if (res.success && res.data) {
        setActivePlan(res.data);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to load roadmap details."));
    } finally {
      setIsPlanLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    if (searchParams.get("role")) {
      setShowCreateModal(true);
    }
  }, []);

  const handleSelectPlan = async (e) => {
    const id = e.target.value;
    setSelectedPlanId(id);
    await loadPlanDetails(id);
  };

  // Toggle item completion
  const handleToggleItem = async (item) => {
    const newStatus = item.status === "completed" ? "pending" : "completed";
    try {
      const res = await updateLearningPlanItemRequest(activePlan.id, item.id, {
        status: newStatus,
      });
      if (res.success) {
        toast.success(newStatus === "completed" ? "🎉 Task completed!" : "Task marked pending.");
        // Update local state optimistically
        setActivePlan((prev) => {
          if (!prev) return prev;
          const updatedItems = prev.items.map((it) =>
            it.id === item.id ? { ...it, status: newStatus } : it
          );
          const completedCount = updatedItems.filter((it) => it.status === "completed").length;
          return {
            ...prev,
            items: updatedItems,
            completedItems: completedCount,
            progressPercentage:
              updatedItems.length > 0
                ? Math.round((completedCount / updatedItems.length) * 100)
                : 0,
          };
        });
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update task status."));
    }
  };

  // Create new plan
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!targetRole.trim()) {
      toast.error("Target role is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const gaps = skillGapsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await createLearningPlanRequest({
        targetRole: targetRole.trim(),
        skillGaps: gaps,
        availableMinutesPerDay: Number(minutesPerDay),
        learningStyle,
        targetDate: targetDate || null,
        sourceInterviewId,
      });

      if (res.success && res.data) {
        toast.success("🎯 Learning roadmap generated!");
        setShowCreateModal(false);
        await fetchPlans(res.data.id);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to create learning plan."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add custom task
  const handleAddCustomTask = async (e) => {
    e.preventDefault();
    if (!newTaskTopic.trim() || !newTaskAction.trim()) {
      toast.error("Please provide both topic and task description.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await addLearningPlanItemRequest(activePlan.id, {
        topic: newTaskTopic.trim(),
        task: newTaskAction.trim(),
        estimatedMinutes: Number(newTaskMinutes),
        practiceOutcome: newTaskOutcome.trim(),
        stage: newTaskStage.trim(),
      });

      if (res.success) {
        toast.success("Custom task added to roadmap!");
        setShowAddTaskModal(false);
        setNewTaskTopic("");
        setNewTaskAction("");
        setNewTaskOutcome("");
        await loadPlanDetails(activePlan.id);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to add custom task."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete task
  const handleDeleteTask = async (itemId) => {
    if (!window.confirm("Remove this task from your roadmap?")) return;
    try {
      const res = await deleteLearningPlanItemRequest(activePlan.id, itemId);
      if (res.success) {
        toast.success("Task removed.");
        await loadPlanDetails(activePlan.id);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to remove task."));
    }
  };

  // Regenerate plan preserving completed tasks
  const handleRegenerate = async () => {
    if (
      !window.confirm(
        "Regenerate remaining roadmap tasks? All completed tasks will be preserved intact."
      )
    )
      return;

    try {
      setIsPlanLoading(true);
      const res = await regenerateLearningPlanRequest(activePlan.id);
      if (res.success && res.data) {
        toast.success("Roadmap refreshed! Completed tasks preserved.");
        setActivePlan(res.data);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to regenerate roadmap."));
    } finally {
      setIsPlanLoading(false);
    }
  };

  // Delete plan
  const handleDeletePlan = async () => {
    if (!window.confirm("Delete this entire learning roadmap? This cannot be undone.")) return;
    try {
      const res = await deleteLearningPlanRequest(activePlan.id);
      if (res.success) {
        toast.success("Learning plan deleted.");
        await fetchPlans();
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete plan."));
    }
  };

  // Group items by stage
  const items = activePlan?.items || [];
  const filteredItems = items.filter((it) => {
    if (statusFilter === "completed") return it.status === "completed";
    if (statusFilter === "pending") return it.status !== "completed";
    return true;
  });

  const stagesMap = {};
  filteredItems.forEach((it) => {
    const stg = it.stage || "Stage 1: Core Fundamentals";
    if (!stagesMap[stg]) stagesMap[stg] = [];
    stagesMap[stg].push(it);
  });

  return (
    <div className="page page--dashboard">
      <div className="dashboard-layout">
        <Sidebar />

        <section className="dashboard-main">
          {/* Header */}
          <div className="dashboard-hero">
            <div>
              <span className="eyebrow">Personalized Progression</span>
              <h1>Technical Learning Roadmap</h1>
              <p>
                Actionable preparation modules tailored to your interview rubric gaps and target job requirements.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setShowCreateModal(true)}
              >
                + New Roadmap
              </button>
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "4rem" }}>
              <Loader />
            </div>
          ) : plans.length === 0 ? (
            <div className="glass-card" style={{ textAlign: "center", padding: "3.5rem" }}>
              <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>🗺️</span>
              <h2 style={{ fontSize: "1.4rem", margin: "0 0 0.5rem" }}>No Learning Roadmaps Active</h2>
              <p style={{ color: "var(--text-muted)", maxWidth: "520px", margin: "0 auto 1.5rem" }}>
                Generate a structured, staged study plan based on your target role and skill gaps, with daily time budgets and vetted documentation references.
              </p>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setShowCreateModal(true)}
              >
                Generate Your First Roadmap
              </button>
            </div>
          ) : (
            <>
              {/* Plan Selector & Quick Action Bar */}
              <div
                className="glass-card"
                style={{
                  padding: "1.25rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: "260px" }}>
                  <label htmlFor="select-plan" style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    Active Plan:
                  </label>
                  <select
                    id="select-plan"
                    value={selectedPlanId || ""}
                    onChange={handleSelectPlan}
                    className="form-input"
                    style={{ padding: "0.45rem 0.75rem", fontSize: "0.9rem", flex: 1, maxWidth: "450px" }}
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title || `${p.target_role} Plan`} ({p.progressPercentage || 0}% Done)
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn btn--outline"
                    style={{ padding: "0.4rem 0.75rem", fontSize: "0.85rem" }}
                    onClick={() => setShowAddTaskModal(true)}
                  >
                    + Add Task
                  </button>
                  <button
                    type="button"
                    className="btn btn--outline"
                    style={{ padding: "0.4rem 0.75rem", fontSize: "0.85rem" }}
                    onClick={handleRegenerate}
                    title="Regenerate remaining incomplete tasks"
                  >
                    🔄 Refresh Tasks
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    style={{ padding: "0.4rem 0.75rem", fontSize: "0.85rem", color: "var(--danger)" }}
                    onClick={handleDeletePlan}
                  >
                    Delete Plan
                  </button>
                </div>
              </div>

              {isPlanLoading ? (
                <div style={{ textAlign: "center", padding: "3rem" }}>
                  <Loader />
                </div>
              ) : activePlan && (
                <>
                  {/* Progress Dashboard Banner */}
                  <div
                    className="glass-card"
                    style={{
                      padding: "1.75rem",
                      marginBottom: "1.75rem",
                      border: "1px solid var(--panel-border)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: "1rem",
                        marginBottom: "1.25rem",
                      }}
                    >
                      <div>
                        <span className="eyebrow" style={{ textTransform: "uppercase" }}>
                          Target Role: {activePlan.target_role}
                        </span>
                        <h2 style={{ fontSize: "1.5rem", margin: "0.2rem 0" }}>
                          {activePlan.title}
                        </h2>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0" }}>
                          Pace: <strong>{activePlan.available_minutes_per_day} mins/day</strong> • Style: <span style={{ textTransform: "capitalize" }}>{activePlan.learning_style}</span>
                        </p>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--teal)", lineHeight: 1 }}>
                          {activePlan.progressPercentage || 0}%
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          {activePlan.completedItems || 0} of {activePlan.totalItems || 0} tasks finished
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div
                      style={{
                        height: "9px",
                        background: "rgba(120, 148, 210, 0.15)",
                        borderRadius: "5px",
                        overflow: "hidden",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.max(2, activePlan.progressPercentage || 0)}%`,
                          background: "linear-gradient(90deg, var(--blue), var(--teal))",
                          borderRadius: "5px",
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>

                    {/* Target Skill Gaps Badges */}
                    {Array.isArray(activePlan.skill_gaps) && activePlan.skill_gaps.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", fontSize: "0.85rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>Targeted Competencies:</span>
                        {activePlan.skill_gaps.map((gap, gIdx) => (
                          <span
                            key={gIdx}
                            style={{
                              background: "rgba(98, 245, 160, 0.12)",
                              color: "var(--accent-mint)",
                              padding: "0.25rem 0.65rem",
                              borderRadius: "9999px",
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              border: "1px solid rgba(98, 245, 160, 0.22)",
                            }}
                          >
                            {gap}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Filter Tabs */}
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
                    {[
                      { id: "all", label: "All Tasks" },
                      { id: "pending", label: "Incomplete" },
                      { id: "completed", label: "Completed" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        style={{
                          background: statusFilter === tab.id ? "var(--accent-mint)" : "rgba(98, 245, 160, 0.08)",
                          color: statusFilter === tab.id ? "#050907" : "var(--text)",
                          border: statusFilter === tab.id ? "none" : "1px solid rgba(98, 245, 160, 0.18)",
                          padding: "0.38rem 0.9rem",
                          borderRadius: "9999px",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          fontWeight: statusFilter === tab.id ? 700 : 500,
                          transition: "all 0.2s ease",
                        }}
                        onClick={() => setStatusFilter(tab.id)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Staged Modules & Tasks List */}
                  {Object.keys(stagesMap).length === 0 ? (
                    <div className="glass-card" style={{ textAlign: "center", padding: "2.5rem" }}>
                      <p style={{ color: "var(--text-muted)" }}>No tasks matching selected filter.</p>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: "1.75rem" }}>
                      {Object.entries(stagesMap).map(([stageName, stageTasks]) => (
                        <div key={stageName}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                            <span style={{ color: "var(--teal)", fontWeight: 700, fontSize: "1.05rem" }}>
                              📌 {stageName}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              ({stageTasks.length} tasks)
                            </span>
                          </div>

                          <div style={{ display: "grid", gap: "0.75rem" }}>
                            {stageTasks.map((taskItem) => {
                              const isDone = taskItem.status === "completed";
                              return (
                                <article
                                  key={taskItem.id}
                                  className="glass-card"
                                  style={{
                                    padding: "1.25rem",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "1rem",
                                    border: isDone ? "1px solid rgba(98, 245, 160, 0.35)" : "1px solid var(--panel-border)",
                                    opacity: isDone ? 0.85 : 1,
                                    background: isDone ? "rgba(98, 245, 160, 0.04)" : "var(--panel)",
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  {/* Completion Checkbox */}
                                  <input
                                    type="checkbox"
                                    checked={isDone}
                                    onChange={() => handleToggleItem(taskItem)}
                                    style={{
                                      marginTop: "0.3rem",
                                      width: "18px",
                                      height: "18px",
                                      accentColor: "var(--accent-mint)",
                                      cursor: "pointer",
                                    }}
                                    id={`task-${taskItem.id}`}
                                  />

                                  {/* Task Info */}
                                  <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                      <label
                                        htmlFor={`task-${taskItem.id}`}
                                        style={{
                                          fontSize: "1rem",
                                          fontWeight: 600,
                                          color: isDone ? "var(--teal)" : "var(--title)",
                                          textDecoration: isDone ? "line-through" : "none",
                                          cursor: "pointer",
                                        }}
                                      >
                                        {taskItem.topic}
                                      </label>

                                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <span className="status-pill" style={{ fontSize: "0.72rem" }}>
                                          ⏱️ {taskItem.estimated_minutes}m
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteTask(taskItem.id)}
                                          style={{
                                            background: "none",
                                            border: "none",
                                            color: "var(--text-muted)",
                                            cursor: "pointer",
                                            fontSize: "0.85rem",
                                            padding: "0 0.3rem",
                                          }}
                                          title="Delete task"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    </div>

                                    <p
                                      style={{
                                        margin: "0 0 0.5rem",
                                        fontSize: "0.88rem",
                                        color: "var(--text)",
                                        lineHeight: 1.5,
                                      }}
                                    >
                                      {taskItem.task}
                                    </p>

                                    {taskItem.practice_outcome && (
                                      <div
                                        style={{
                                          fontSize: "0.8rem",
                                          color: "var(--text-muted)",
                                          marginBottom: "0.5rem",
                                          background: "rgba(0,0,0,0.2)",
                                          padding: "0.35rem 0.65rem",
                                          borderRadius: "4px",
                                          display: "inline-block",
                                        }}
                                      >
                                        💡 <strong>Outcome:</strong> {taskItem.practice_outcome}
                                      </div>
                                    )}

                                    {taskItem.resource_url && (
                                      <div>
                                        <a
                                          href={taskItem.resource_url}
                                          target="_blank"
                                          rel="noreferrer"
                                          style={{
                                            color: "var(--blue)",
                                            fontSize: "0.8rem",
                                            fontWeight: 500,
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "0.3rem",
                                          }}
                                        >
                                          📖 Official Documentation Reference →
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </article>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Modal: Generate New Plan */}
          {showCreateModal && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                zIndex: 1000,
              }}
            >
              <div
                className="glass-card"
                style={{
                  maxWidth: "520px",
                  width: "100%",
                  padding: "2rem",
                  background: "#0d1527",
                  border: "1px solid var(--panel-border)",
                  borderRadius: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.25rem" }}>Generate Personalized Roadmap</h3>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.2rem", cursor: "pointer" }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreatePlan} style={{ display: "grid", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Target Role *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Senior Backend Engineer"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Focus Areas / Skill Gaps (comma-separated)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={skillGapsInput}
                      onChange={(e) => setSkillGapsInput(e.target.value)}
                      placeholder="e.g. PostgreSQL, System Design, Docker, Redis"
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                        Daily Study Time
                      </label>
                      <select
                        className="form-input"
                        value={minutesPerDay}
                        onChange={(e) => setMinutesPerDay(e.target.value)}
                      >
                        <option value={30}>30 mins/day</option>
                        <option value={45}>45 mins/day</option>
                        <option value={60}>60 mins/day</option>
                        <option value={90}>90 mins/day</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                        Learning Style
                      </label>
                      <select
                        className="form-input"
                        value={learningStyle}
                        onChange={(e) => setLearningStyle(e.target.value)}
                      >
                        <option value="balanced">Balanced (Theory + Build)</option>
                        <option value="hands-on">Hands-on (Implementation)</option>
                        <option value="deep-dive">Deep Dive (Internals)</option>
                        <option value="fast-track">Fast Track (High-yield)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                    <button
                      type="button"
                      className="btn btn--outline"
                      onClick={() => setShowCreateModal(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn--primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Generating Roadmap..." : "Generate Roadmap"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal: Add Custom Task */}
          {showAddTaskModal && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                zIndex: 1000,
              }}
            >
              <div
                className="glass-card"
                style={{
                  maxWidth: "500px",
                  width: "100%",
                  padding: "2rem",
                  background: "#0d1527",
                  border: "1px solid var(--panel-border)",
                  borderRadius: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.25rem" }}>Add Custom Study Task</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddTaskModal(false)}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.2rem", cursor: "pointer" }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddCustomTask} style={{ display: "grid", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Topic Name *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={newTaskTopic}
                      onChange={(e) => setNewTaskTopic(e.target.value)}
                      placeholder="e.g. Distributed Tracing with OpenTelemetry"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Task Description *
                    </label>
                    <textarea
                      className="form-input"
                      value={newTaskAction}
                      onChange={(e) => setNewTaskAction(e.target.value)}
                      placeholder="Describe what you plan to study, read, or build..."
                      rows={3}
                      required
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                        Time Estimate (mins)
                      </label>
                      <input
                        type="number"
                        className="form-input"
                        value={newTaskMinutes}
                        onChange={(e) => setNewTaskMinutes(e.target.value)}
                        min={15}
                        max={300}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                        Stage / Category
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={newTaskStage}
                        onChange={(e) => setNewTaskStage(e.target.value)}
                        placeholder="e.g. Custom Electives"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                      Expected Outcome (optional)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={newTaskOutcome}
                      onChange={(e) => setNewTaskOutcome(e.target.value)}
                      placeholder="e.g. Working tracing middleware in Express"
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                    <button
                      type="button"
                      className="btn btn--outline"
                      onClick={() => setShowAddTaskModal(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn--primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add to Roadmap"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default LearningRoadmap;
