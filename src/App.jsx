
import './App.css'
import syllabus from './data/syllabus/articles.json'

function App() {
  const modules = [
    {
      number: '01',
      title: 'Introduction to Articles',
      description: 'Understand the basics of English articles.',
      topics: 4,
      status: 'Start learning',
      icon: '📖'
    },
    {
      number: '02',
      title: 'Indefinite Articles – A & An',
      description: 'Learn the rules and usage of A and An.',
      topics: 8,
      status: 'Locked',
      icon: '🔤'
    },
    {
      number: '03',
      title: 'Definite Article – The',
      description: 'Understand when and how to use The.',
      topics: 8,
      status: 'Locked',
      icon: '📚'
    },
    {
      number: '04',
      title: 'Zero Articles',
      description: 'Learn when articles are not required.',
      topics: 6,
      status: 'Locked',
      icon: '✏️'
    },
    {
      number: '05',
      title: 'Advanced Rules',
      description: 'Explore exceptions and advanced usage.',
      topics: 7,
      status: 'Locked',
      icon: '🎯'
    },
    {
      number: '06',
      title: 'Practice & Assessment',
      description: 'Test your understanding of articles.',
      topics: 5,
      status: 'Locked',
      icon: '🏆'
    }
  ]

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
            {modules.map((module) => (
              <div className="col-12 col-md-6" key={module.number}>
                <div className="card module-card h-100">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between mb-3">
                      <span className="module-icon">{module.icon}</span>
                      <span className="text-secondary small">
                        MODULE {module.number}
                      </span>
                    </div>

                    <h5 className="fw-bold">{module.title}</h5>
                    <p className="text-secondary small">
                      {module.description}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-secondary">
                        {module.topics} subtopics
                      </small>
                      <span className="badge rounded-pill text-bg-light border">
                        {module.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

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
