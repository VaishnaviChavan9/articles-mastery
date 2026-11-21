
import './App.css'
import syllabus from './data/syllabus/articles.json'
import { useState } from 'react'
import LessonView from './components/LessonView'
import module01Lessons from './data/lessons/module-01.json'
import PracticeView from './components/PracticeView'
import practiceQuestions from './data/questions/module-01-01.json'
import practiceQuestions02 from './data/questions/module-01-02.json'
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

  return (
    <div className="app-container">

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container py-2">
          <a className="navbar-brand fw-bold fs-4" href="#">
            <span className="brand-icon">A</span> Articles Mastery
          </a>
          <span className="badge text-bg-light border">
            Version 1.0
          </span>
        </div>
      </nav>

      <main className="container py-4 py-md-5">


        {showPractice ? (
          <PracticeView
            questions={
              selectedSubtopic.id === 'subtopic-01-02'
                ? practiceQuestions02.questions
                : practiceQuestions.questions
            }
            subtopicId={selectedSubtopic.id}
            onBack={() => setShowPractice(false)}
            onComplete={(result) => {
              setSavedProgress(result)

              const updated = [
                ...new Set([...completedSubtopics, result.subtopicId])
              ]

              setCompletedSubtopics(updated)

              localStorage.setItem(
                'articlesMasteryCompleted',
                JSON.stringify(updated)
              )
            }}
          />
        ) : selectedSubtopic ? (
          <LessonView
            lesson={module01Lessons.lessons.find(
              lesson => lesson.subtopicId === selectedSubtopic.id
            )}
            onBack={() => setSelectedSubtopic(null)}
            onStartPractice={() => setShowPractice(true)}
          />
        ) : selectedModule ? (
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
              {selectedModule.subtopics.map((subtopic, index) => (
                <div className="col-12" key={subtopic.id}>
                  <button
                    type="button"
                    className="card module-card w-100 text-start"
                    disabled={
                      selectedModule.id !== 'module-01' ||
                      (index !== 0 &&
                        !completedSubtopics.includes(
                          selectedModule.subtopics[index - 1].id
                        ) &&
                        !completedSubtopics.includes(subtopic.id))
                    }
                    onClick={() => setSelectedSubtopic(subtopic)}
                  >
                    <div className="card-body p-3 p-md-4">

                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-secondary">
                          DAY {index + 1}
                        </small>

                        <span className={`badge ${index === 0 && selectedModule.id === 'module-01'
                          ? 'text-bg-success'
                          : 'text-bg-light border'
                          }`}>
                          {completedSubtopics.includes(subtopic.id)
                            ? 'Completed'
                            : index === 0 ||
                              completedSubtopics.includes(selectedModule.subtopics[index - 1]?.id)
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
              ))}
            </div>
          </section>

        ) : (
          <>

            {/* Welcome section */}
            <section className="welcome-section mb-4">
              <p className="text-secondary mb-1">YOUR DAILY LEARNING SPACE</p>
              <h1 className="fw-bold">Master English Articles.</h1>
              <p className="text-secondary">
                Learn the rules, practise every day and improve your English.
              </p>
            </section>

            {/* Progress cards */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-md-4">
                <div className="card stat-card h-100">
                  <div className="card-body">
                    <p className="text-secondary small mb-2">Modules</p>
                    <h2 className="fw-bold mb-0">6</h2>
                    <small className="text-secondary">Total modules</small>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-4">
                <div className="card stat-card h-100">
                  <div className="card-body">
                    <p className="text-secondary small mb-2">Daily practice</p>
                    <h2 className="fw-bold mb-0">20</h2>
                    <small className="text-secondary">Questions per day</small>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="card stat-card h-100">
                  <div className="card-body">
                    <p className="text-secondary small mb-2">Your progress</p>
                    <h2 className="fw-bold mb-0">0%</h2>
                    <small className="text-secondary">Not started yet</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="card stat-card h-100">
                  <div className="card-body p-4">
                    <p className="text-secondary mb-2">Latest Practice Score</p>

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
            {/* Today's lesson */}
            <section className="today-card p-4 mb-5">
              <div className="row align-items-center g-3">
                <div className="col-md-8">
                  <span className="badge bg-white text-primary mb-3">
                    TODAY'S LEARNING
                  </span>
                  <h3 className="fw-bold">Day 01 – Introduction to Articles</h3>
                  <p className="mb-3">
                    Start with the basics of A, An and The.
                    Understand what articles are and why we use them.
                  </p>
                  <button className="btn btn-primary px-4">
                    Start learning →
                  </button>
                </div>
                <div className="col-md-4 text-center">
                  <div className="today-icon">📘</div>
                </div>
              </div>
            </section>

            {/* Modules */}
            <section>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="fw-bold mb-1">Learning modules</h3>
                  <p className="text-secondary mb-0">
                    Follow the modules in sequence.
                  </p>
                </div>
              </div>

              <div className="row g-3">

                {syllabus.modules.map((module, index) => (
                  <div className="col-12 col-md-6" key={module.id}>
                    <button
                      type="button"
                      className="card module-card h-100 w-100 text-start"
                      onClick={() => index === 0 && setSelectedModule(module)}
                      disabled={index !== 0}
                    >
                      <div className="card-body p-4">

                        <div className="d-flex justify-content-between mb-3">
                          <span className="module-icon">{module.icon}</span>
                          <span className="text-secondary small">
                            MODULE {String(module.order).padStart(2, '0')}
                          </span>
                        </div>

                        <h5 className="fw-bold">{module.title}</h5>

                        <p className="text-secondary small">
                          {module.difficulty} level
                        </p>

                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <small className="text-secondary">
                            {module.subtopics.length} subtopics
                          </small>

                          <span className={`badge rounded-pill ${index === 0
                            ? 'text-bg-primary'
                            : 'text-bg-light border'
                            }`}>
                            {index === 0 ? 'Start learning' : 'Locked'}
                          </span>
                        </div>

                      </div>
                    </button>
                  </div>
                ))}


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
