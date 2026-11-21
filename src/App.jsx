
import { useState } from 'react'
import syllabus from './data/syllabus/articles.json'
import LessonView from './components/LessonView'
import PracticeView from './components/PracticeView'
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

function App() {
  const [selectedModule, setSelectedModule] = useState(null)
  const [selectedSubtopic, setSelectedSubtopic] = useState(null)
  const [showPractice, setShowPractice] = useState(false)

  const [savedProgress, setSavedProgress] = useState(() => {
    const saved = localStorage.getItem('articlesMasteryProgress')
    return saved ? JSON.parse(saved) : null
  })

  const [completedSubtopics, setCompletedSubtopics] = useState(() => {
    const saved = localStorage.getItem('articlesMasteryCompleted')
    return saved ? JSON.parse(saved) : []
  })

  // Calculate overall course progress
  const totalSubtopics = syllabus.modules.reduce(
    (total, module) => total + module.subtopics.length,
    0
  )

  const progressPercentage = totalSubtopics > 0
    ? Math.round((completedSubtopics.length / totalSubtopics) * 100)
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

  // Save completed subtopic and latest quiz result
  function handlePracticeComplete(result) {
    setSavedProgress(result)

    localStorage.setItem(
      'articlesMasteryProgress',
      JSON.stringify(result)
    )

    const updated = [
      ...new Set([...completedSubtopics, result.subtopicId])
    ]

    setCompletedSubtopics(updated)

    localStorage.setItem(
      'articlesMasteryCompleted',
      JSON.stringify(updated)
    )
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

        {/* Practice Screen */}
        {showPractice ? (
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

                          <span className={`badge ${
                            completed
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

            {/* Statistics */}
            <div className="row g-3 mb-4">

              <div className="col-6 col-md-4">
                <div className="card stat-card h-100">
                  <div className="card-body">
                    <p className="text-secondary small mb-2">
                      Modules
                    </p>

                    <h2 className="fw-bold mb-0">
                      {syllabus.modules.length}
                    </h2>

                    <small className="text-secondary">
                      Total modules
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-4">
                <div className="card stat-card h-100">
                  <div className="card-body">
                    <p className="text-secondary small mb-2">
                      Daily practice
                    </p>

                    <h2 className="fw-bold mb-0">20</h2>

                    <small className="text-secondary">
                      Questions per day
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="card stat-card h-100">
                  <div className="card-body">
                    <p className="text-secondary small mb-2">
                      Your progress
                    </p>

                    <h2 className="fw-bold mb-0">
                      {progressPercentage}%
                    </h2>

                    <small className="text-secondary">
                      {completedSubtopics.length} of {totalSubtopics} completed
                    </small>

                    <div className="progress mt-3" style={{ height: '7px' }}>
                      <div
                        className="progress-bar"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Latest Score */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="card stat-card h-100">
                  <div className="card-body p-4">
                    <p className="text-secondary mb-2">
                      Latest Practice Score
                    </p>

                    <h2 className="fw-bold mb-1">
                      {savedProgress
                        ? `${savedProgress.score}/${savedProgress.totalQuestions}`
                        : 'Not attempted'}
                    </h2>

                    <small className="text-secondary">
                      {savedProgress
                        ? `Completed: ${new Date(savedProgress.completedAt).toLocaleDateString()}`
                        : 'Complete your first practice to see your score.'}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Learning */}
            <section className="today-card p-4 mb-5">
              <div className="row align-items-center g-3">
                <div className="col-md-8">
                  <span className="badge bg-white text-primary mb-3">
                    TODAY'S LEARNING
                  </span>

                  <h3 className="fw-bold">
                    Continue your learning
                  </h3>

                  <p className="mb-3">
                    Follow your syllabus in sequence and complete one
                    subtopic at a time.
                  </p>

                  <button
                    className="btn btn-primary px-4"
                    onClick={() => {
                      setSelectedModule(syllabus.modules[0])
                    }}
                  >
                    Start learning →
                  </button>
                </div>

                <div className="col-md-4 text-center">
                  <div className="today-icon">📘</div>
                </div>
              </div>
            </section>

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

                            <span className={`badge rounded-pill ${
                              unlocked
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

    </div>
  )
}

export default App
