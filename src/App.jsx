
import { useState } from 'react'
import syllabus from './data/syllabus/articles.json'
import LessonView from './components/LessonView'
import PracticeView from './components/PracticeView'
import DailyChallengeView from './components/DailyChallengeView'
import NotificationModal from './components/NotificationModal'
import './App.css'

// Automatically load all lesson JSON files
const lessonFiles = import.meta.glob(
  './data/lessons/*.json',
  { eager: true, import: 'default' }
)

// Automatically load all question bank JSON files
const questionFiles = import.meta.glob(
  './data/questions/*.json',
  { eager: true, import: 'default' }
)

// Combine lessons from all lesson files
const allLessons = Object.values(lessonFiles).flatMap(
  file => file.lessons || []
)

// Collect all question banks
const allQuestionBanks = Object.values(questionFiles)

// Prepare questions from all six modules
const allDailyQuestions = syllabus.modules.flatMap(module =>
  module.subtopics.flatMap(subtopic => {
    const bank = allQuestionBanks.find(
      item => item.subtopicId === subtopic.id
    )

    return (bank?.questions || []).map(question => ({
      ...question,
      subtopicId: subtopic.id,
      subtopicTitle: subtopic.title,
      moduleId: module.id,
      moduleTitle: module.title,
      questionKey: `${subtopic.id}-${question.id}`
    }))
  })
)

function App() {
  const [selectedModule, setSelectedModule] = useState(null)
  const [selectedSubtopic, setSelectedSubtopic] = useState(null)
  const [showPractice, setShowPractice] = useState(false)
  const [showDailyChallenge, setShowDailyChallenge] = useState(false)
  const [showDailyReminder, setShowDailyReminder] = useState(() => {
    const today = getTodayDateKey()
    return localStorage.getItem('articlesMasteryReminderDate') !== today
  })

  const [showResetConfirmation, setShowResetConfirmation] = useState(false)
  // Load previous practice attempts
  const [practiceHistory, setPracticeHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('articlesMasteryHistory')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Load completed subtopics
  const [completedSubtopics, setCompletedSubtopics] = useState(() => {
    try {
      const saved = localStorage.getItem('articlesMasteryCompleted')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Load daily challenge personal best
  const [dailyChallengeBest, setDailyChallengeBest] = useState(() => {
    try {
      const saved = localStorage.getItem('articlesMasteryDailyBest')
      return saved ? Number(saved) : 0
    } catch {
      return 0
    }
  })

  // Load today's question set
  const [dailyChallengeQuestions] = useState(
    () => getDailyChallengeQuestions()
  )

  // Calculate overall course progress
  const totalSubtopics = syllabus.modules.reduce(
    (total, module) => total + module.subtopics.length,
    0
  )

  const progressPercentage = totalSubtopics > 0
    ? Math.round((completedSubtopics.length / totalSubtopics) * 100)
    : 0

  // Calculate cumulative practice accuracy
  const totalScore = practiceHistory.reduce(
    (total, attempt) => total + attempt.score,
    0
  )

  const totalQuestionsAttempted = practiceHistory.reduce(
    (total, attempt) => total + attempt.totalQuestions,
    0
  )

  const accuracy = totalQuestionsAttempted > 0
    ? Math.round((totalScore / totalQuestionsAttempted) * 100)
    : 0

  // Find the lesson belonging to the selected subtopic
  const currentLesson = selectedSubtopic
    ? allLessons.find(
      lesson => lesson.subtopicId === selectedSubtopic.id
    )
    : null

  // Find the question bank belonging to the selected subtopic
  const currentQuestionBank = selectedSubtopic
    ? allQuestionBanks.find(
      bank => bank.subtopicId === selectedSubtopic.id
    )
    : null

  // Check whether a module is unlocked
  function isModuleUnlocked(moduleIndex) {
    if (moduleIndex === 0) return true

    const previousModule = syllabus.modules[moduleIndex - 1]

    return previousModule.subtopics.every(
      subtopic => completedSubtopics.includes(subtopic.id)
    )
  }

  // Check whether a subtopic is unlocked
  function isSubtopicUnlocked(module, index) {
    const moduleIndex = syllabus.modules.findIndex(
      item => item.id === module.id
    )

    if (!isModuleUnlocked(moduleIndex)) return false

    if (completedSubtopics.includes(module.subtopics[index].id)) {
      return true
    }

    if (index === 0) return true

    return completedSubtopics.includes(
      module.subtopics[index - 1].id
    )
  }

  // Add unlock information to daily challenge questions
  function getDailyQuestionDetails(question) {
    const module = syllabus.modules.find(
      item => item.id === question.moduleId
    )

    const subtopicIndex = module.subtopics.findIndex(
      item => item.id === question.subtopicId
    )

    return {
      ...question,
      chapterUnlocked: isSubtopicUnlocked(module, subtopicIndex)
    }
  }

  function handleDailyReminderLater() {
    localStorage.setItem(
      'articlesMasteryReminderDate',
      getTodayDateKey()
    )
    setShowDailyReminder(false)
  }

  function handleStartFromReminder() {
    handleDailyReminderLater()
    setShowDailyChallenge(true)
  }
  // Save regular practice results
  function handlePracticeComplete(result) {
    const updatedHistory = [...practiceHistory, result]

    setPracticeHistory(updatedHistory)

    localStorage.setItem(
      'articlesMasteryHistory',
      JSON.stringify(updatedHistory)
    )

    const updatedCompleted = [
      ...new Set([...completedSubtopics, result.subtopicId])
    ]

    setCompletedSubtopics(updatedCompleted)

    localStorage.setItem(
      'articlesMasteryCompleted',
      JSON.stringify(updatedCompleted)
    )
  }

  // Save daily challenge personal best
  function handleDailyChallengeComplete(score) {
    if (score > dailyChallengeBest) {
      setDailyChallengeBest(score)

      localStorage.setItem(
        'articlesMasteryDailyBest',
        String(score)
      )
    }
  }

  // Reset all learning progress
  function handleResetProgress() {
    localStorage.removeItem('articlesMasteryHistory')
    localStorage.removeItem('articlesMasteryCompleted')
    localStorage.removeItem('articlesMasteryProgress')
    localStorage.removeItem('articlesMasteryDailyBest')

    setPracticeHistory([])
    setCompletedSubtopics([])
    setDailyChallengeBest(0)

    setSelectedModule(null)
    setSelectedSubtopic(null)
    setShowPractice(false)
    setShowDailyChallenge(false)

    setShowResetConfirmation(false)
  }

  return (
    <div className="app-container">

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container py-2">
          <a
            className="navbar-brand fw-bold fs-4"
            href="#"
            onClick={() => {
              setShowPractice(false)
              setSelectedSubtopic(null)
              setSelectedModule(null)
              setShowDailyChallenge(false)
            }}
          >
            <span className="brand-icon">A</span> Articles Mastery
          </a>

          <span className="badge text-bg-light border">
            Version 1.0
          </span>
        </div>
      </nav>

      <main className="container py-4 py-md-5">

        {/* Daily Challenge Screen */}
        {showDailyChallenge ? (
          <DailyChallengeView
            questions={dailyChallengeQuestions.map(getDailyQuestionDetails)}
            bestScore={dailyChallengeBest}
            onComplete={handleDailyChallengeComplete}
            onBack={() => setShowDailyChallenge(false)}
          />
        ) : showPractice ? (
          currentQuestionBank ? (
            <PracticeView
              questions={currentQuestionBank.questions}
              subtopicId={selectedSubtopic.id}
              onBack={() => setShowPractice(false)}
              onComplete={handlePracticeComplete}
            />
          ) : (
            <div className="alert alert-warning">
              Question bank is not available for this subtopic yet.
              <button
                className="btn btn-link"
                onClick={() => setShowPractice(false)}
              >
                Go back
              </button>
            </div>
          )

        ) : selectedSubtopic ? (

          /* Lesson Screen */
          currentLesson ? (
            <LessonView
              lesson={currentLesson}
              onBack={() => setSelectedSubtopic(null)}
              onStartPractice={() => setShowPractice(true)}
            />
          ) : (
            <div className="alert alert-warning">
              Lesson content is not available yet.
              <button
                className="btn btn-link"
                onClick={() => setSelectedSubtopic(null)}
              >
                Go back
              </button>
            </div>
          )

        ) : selectedModule ? (

          /* Module Screen */
          <section>
            <button
              className="btn btn-outline-secondary mb-4"
              onClick={() => setSelectedModule(null)}
            >
              ← Back to modules
            </button>

            <div className="mb-4">
              <span className="badge text-bg-primary mb-2">
                MODULE {String(selectedModule.order).padStart(2, '0')}
              </span>

              <h2 className="fw-bold">{selectedModule.title}</h2>

              <p className="text-secondary">
                Complete each subtopic in sequence to master this module.
              </p>
            </div>

            <div className="row g-3">
              {selectedModule.subtopics.map((subtopic, index) => {
                const completed = completedSubtopics.includes(subtopic.id)
                const available = isSubtopicUnlocked(selectedModule, index)

                return (
                  <div className="col-12" key={subtopic.id}>
                    <button
                      type="button"
                      className="card module-card w-100 text-start"
                      disabled={!available}
                      onClick={() => setSelectedSubtopic(subtopic)}
                    >
                      <div className="card-body p-3 p-md-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-secondary">
                            DAY {index + 1}
                          </small>

                          <span className={`badge ${completed
                            ? 'text-bg-success'
                            : available
                              ? 'text-bg-primary'
                              : 'text-bg-light border'
                            }`}>
                            {completed
                              ? 'Completed'
                              : available
                                ? 'Available'
                                : 'Locked'}
                          </span>
                        </div>

                        <h5 className="fw-bold mb-2">
                          {subtopic.title}
                        </h5>

                        <p className="text-secondary small mb-0">
                          Learn the concept, understand examples and practise
                          20 questions.
                        </p>
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          </section>

        ) : (

          /* Dashboard */
          <>
            <section className="welcome-section mb-4">
              <p className="text-secondary mb-1">
                YOUR DAILY LEARNING SPACE
              </p>

              <h1 className="fw-bold">
                Master English Articles.
              </h1>

              <p className="text-secondary">
                Learn the rules, practise every day and improve your English.
              </p>
            </section>

            {/* Four Main Statistics Cards */}
            <div className="row g-3 mb-5">

              {/* Total Modules */}
              <div className="col-6 col-md-3">
                <div className="card stat-card h-100">
                  <div className="card-body p-3 p-md-4">
                    <p className="text-secondary small mb-2">
                      Total Modules
                    </p>

                    <h2 className="fw-bold mb-1">
                      {syllabus.modules.length}
                    </h2>

                    <small className="text-secondary">
                      Learning modules
                    </small>
                  </div>
                </div>
              </div>

              {/* Completed Topics */}
              <div className="col-6 col-md-3">
                <div className="card stat-card h-100">
                  <div className="card-body p-3 p-md-4">
                    <p className="text-secondary small mb-2">
                      Completed Topics
                    </p>

                    <h2 className="fw-bold mb-1">
                      {completedSubtopics.length}/{totalSubtopics}
                    </h2>

                    <small className="text-secondary">
                      {progressPercentage}% course progress
                    </small>
                  </div>
                </div>
              </div>

              {/* Overall Accuracy */}
              <div className="col-6 col-md-3">
                <div className="card stat-card h-100">
                  <div className="card-body p-3 p-md-4">
                    <p className="text-secondary small mb-2">
                      Overall Accuracy
                    </p>

                    <h2 className="fw-bold mb-1">
                      {accuracy}%
                    </h2>

                    <small className="text-secondary">
                      Regular practice
                    </small>
                  </div>
                </div>
              </div>

              {/* Daily Challenge Best */}
              <div className="col-6 col-md-3">
                <div className="card stat-card h-100">
                  <div className="card-body p-3 p-md-4">
                    <p className="text-secondary small mb-2">
                      Daily Challenge Best
                    </p>

                    <h2 className="fw-bold mb-1 text-success">
                      {dailyChallengeBest}/20
                    </h2>

                    <small className="text-secondary">
                      Personal best
                    </small>
                  </div>
                </div>
              </div>

            </div>

            {/* Daily Challenge */}
            <section className="today-card p-4 mb-5">
              <div className="row align-items-center g-3">
                <div className="col-md-8">

                  <span className="badge bg-white text-primary mb-3">
                    TODAY'S CHALLENGE
                  </span>

                  <h3 className="fw-bold">
                    20 questions. All six modules.
                  </h3>

                  <p className="mb-3">
                    Test your understanding of English articles with a
                    fresh set of questions every day.
                  </p>

                  <div className="mb-3">
                    <span className="fw-semibold">
                      🏆 Your highest score:
                    </span>

                    <span className="fw-bold ms-2">
                      {dailyChallengeBest}/20
                    </span>
                  </div>

                  <button
                    className="btn btn-primary px-4"
                    onClick={() => setShowDailyChallenge(true)}
                  >
                    Start Daily Challenge →
                  </button>

                </div>

                <div className="col-md-4 text-center">
                  <div className="today-icon">🎯</div>
                </div>
              </div>
            </section>

            {/* Reset Progress */}
            <div className="d-flex justify-content-end mb-3">
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => setShowResetConfirmation(true)}
              >
                <i className="bi bi-arrow-counterclockwise me-1"></i>
                Reset Progress
              </button>
            </div>

            {/* Learning Modules */}
            <section>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="fw-bold mb-1">
                    Learning modules
                  </h3>

                  <p className="text-secondary mb-0">
                    Follow the modules in sequence.
                  </p>
                </div>
              </div>

              <div className="row g-3">
                {syllabus.modules.map((module, index) => {
                  const unlocked = isModuleUnlocked(index)

                  const completedCount = module.subtopics.filter(
                    subtopic => completedSubtopics.includes(subtopic.id)
                  ).length

                  return (
                    <div className="col-12 col-md-6" key={module.id}>
                      <button
                        type="button"
                        className="card module-card h-100 w-100 text-start"
                        onClick={() => setSelectedModule(module)}
                        disabled={!unlocked}
                      >
                        <div className="card-body p-4">

                          <div className="d-flex justify-content-between mb-3">
                            <span className="module-icon">
                              {module.icon}
                            </span>

                            <span className="text-secondary small">
                              MODULE {String(module.order).padStart(2, '0')}
                            </span>
                          </div>

                          <h5 className="fw-bold">
                            {module.title}
                          </h5>

                          <p className="text-secondary small">
                            {module.difficulty} level
                          </p>

                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <small className="text-secondary">
                              {completedCount}/{module.subtopics.length} completed
                            </small>

                            <span className={`badge rounded-pill ${unlocked
                              ? 'text-bg-primary'
                              : 'text-bg-light border'
                              }`}>
                              {unlocked ? 'Start learning' : 'Locked'}
                            </span>
                          </div>

                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          </>
        )}

      </main>

      <footer className="text-center py-4 border-top bg-white">
        <small className="text-secondary">
          Articles Mastery · Learn a little every day.
        </small>
      </footer>
      {showDailyReminder && (
        <NotificationModal
          title="Your Daily Challenge is waiting!"
          message="Take a few minutes to practise 20 questions on English articles. Can you beat your personal best today?"
          type="info"
          confirmText="Start Challenge"
          cancelText="Maybe Later"
          onConfirm={handleStartFromReminder}
          onCancel={handleDailyReminderLater}
        />
      )}

      {showResetConfirmation && (
        <NotificationModal
          title="Reset your progress?"
          message="This will permanently clear completed topics, regular practice scores and your Daily Challenge personal best. This action cannot be undone."
          type="danger"
          confirmText="Yes, Reset"
          cancelText="Cancel"
          onConfirm={handleResetProgress}
          onCancel={() => setShowResetConfirmation(false)}
        />
      )}
    </div>
  )
}

// Get today's date
function getTodayDateKey() {
  const date = new Date()

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// Get or generate today's 20 questions
function getDailyChallengeQuestions() {
  const today = getTodayDateKey()

  try {
    const saved = localStorage.getItem('articlesMasteryDailyChallenge')

    if (saved) {
      const parsed = JSON.parse(saved)

      if (parsed.date === today && Array.isArray(parsed.questionKeys)) {
        const savedQuestions = parsed.questionKeys.map(key =>
          allDailyQuestions.find(question => question.questionKey === key)
        )

        if (
          savedQuestions.length === 20 &&
          savedQuestions.every(question => question)
        ) {
          return savedQuestions
        }
      }
    }
  } catch {
    // Generate a fresh challenge if saved data is invalid
  }

  // Shuffle questions
  const shuffled = [...allDailyQuestions]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  const selected = shuffled.slice(0, 20)

  localStorage.setItem(
    'articlesMasteryDailyChallenge',
    JSON.stringify({
      date: today,
      questionKeys: selected.map(question => question.questionKey)
    })
  )

  return selected
}

export default App
