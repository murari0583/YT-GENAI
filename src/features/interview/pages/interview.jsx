import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import '../style/interview.scss';

const Interview = () => {
  const { interviewId } = useParams();
  const { state } = useLocation();

  const report = state?.report || {};
  const interviewMetadata = report.interviewMetadata || {};
  const recommendation = report.recommendation || {};
  const technicalQuestions = report.technicalQuestions || [];
  const behavioralQuestions = report.behavioralQuestions || [];
  const skillsGap = report.skillsGap || [];
  const weeklyRoadmap = report.weeklyRoadmap || [];
  const [activeSection, setActiveSection] = useState('overview');

  const handleDownload = () => {
    if (!report || Object.keys(report).length === 0) {
      return;
    }

    const safeId = interviewId || `report-${Date.now()}`;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `evaluation-${safeId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className='interview-page'>
      <div className='interview-page__glow interview-page__glow--one' />
      <div className='interview-page__glow interview-page__glow--two' />

      <section className='interview-shell'>
        <nav className='interview-nav'>
          <div className='interview-nav__brand'>
            <span className='brand-mark'>IR</span>
            <div>
              <p className='brand-title'>Interview Radar</p>
              <p className='brand-subtitle'>Candidate Evaluation Suite</p>
            </div>
          </div>

          <div className='interview-nav__actions'>
            <Link to='/' className='nav-link'>New Report</Link>
            <Link to='/' className='nav-link nav-link--ghost'>Dashboard</Link>
            <button
              type='button'
              className='nav-link nav-link--ghost nav-link--button'
              onClick={handleDownload}
              disabled={!report || Object.keys(report).length === 0}
            >
              Download
            </button>
          </div>
        </nav>

        <section className='interview-report'>
        <header className='interview-report__header'>
          <div>
            <p className='interview-report__eyebrow'>Interview Report</p>
            <h1>Candidate Evaluation Summary</h1>
            <p className='interview-report__subtitle'>
              Review interview insights, skills gap, and recommendations in one place.
            </p>
          </div>

          <div className='interview-report__id'>
            <span>Report ID</span>
            <strong>{interviewId || 'preview'}</strong>
          </div>
        </header>

        <div className='report-layout'>
          <aside className='eval-sidebar' aria-label='Evaluation navigation'>
            <p className='eval-sidebar__title'>Evaluations</p>
            <nav className='eval-sidebar__nav'>
              <button type='button' className={activeSection === 'overview' ? 'is-active' : ''} onClick={() => setActiveSection('overview')}>Overview</button>
              <button type='button' className={activeSection === 'technical' ? 'is-active' : ''} onClick={() => setActiveSection('technical')}>Technical</button>
              <button type='button' className={activeSection === 'behavioral' ? 'is-active' : ''} onClick={() => setActiveSection('behavioral')}>Behavioral</button>
              <button type='button' className={activeSection === 'skills' ? 'is-active' : ''} onClick={() => setActiveSection('skills')}>Skills Gap</button>
              <button type='button' className={activeSection === 'recommendation' ? 'is-active' : ''} onClick={() => setActiveSection('recommendation')}>Recommendation</button>
              <button type='button' className={activeSection === 'roadmap' ? 'is-active' : ''} onClick={() => setActiveSection('roadmap')}>Roadmap</button>
              <button type='button' className={activeSection === 'tips' ? 'is-active' : ''} onClick={() => setActiveSection('tips')}>Preparation Tips</button>
              <button type='button' className={activeSection === 'feedback' ? 'is-active' : ''} onClick={() => setActiveSection('feedback')}>Overall Feedback</button>
            </nav>

            <div className='eval-sidebar__summary'>
              <span>Match Score</span>
              <strong>{typeof report.matchScore === 'number' ? `${report.matchScore}%` : '--%'}</strong>
            </div>
          </aside>

          <div className='report-content'>
            {activeSection === 'overview' && <section id='overview' className='report-grid'>
              <article className='report-card'>
                <h2>Interview Metadata</h2>
                <div className='meta-list'>
                  <p><span>Candidate:</span> {interviewMetadata.candidateName || 'Not provided'}</p>
                  <p><span>Position:</span> {interviewMetadata.positionApplied || 'Not provided'}</p>
                  <p><span>Interview Date:</span> {interviewMetadata.dateOfInterview || 'Not provided'}</p>
                  <p><span>Interviewer:</span> {interviewMetadata.interviewerName || 'Not provided'}</p>
                </div>
              </article>

              <article className='report-card report-card--score'>
                <h2>Match Score</h2>
                <p className='score-badge'>{typeof report.matchScore === 'number' ? `${report.matchScore}%` : '--%'}</p>
                <p className='score-caption'>
                  {typeof report.matchScore === 'number' ? 'Candidate-to-role match based on submitted inputs.' : 'Generate a report to see candidate-to-role match.'}
                </p>
              </article>
            </section>}

            {activeSection === 'technical' && <section id='technical' className='report-card'>
              <h2>Technical Questions</h2>
              <ul className='qa-list'>
                {technicalQuestions.length > 0 ? technicalQuestions.map((item, idx) => (
                  <li key={`tech-${idx}`}>
                    <strong>{item.question}</strong>
                    <p>{item.intention}</p>
                    <p>{item.answer}</p>
                  </li>
                )) : <li>Questions will appear here after report generation.</li>}
              </ul>
            </section>}

            {activeSection === 'behavioral' && <section id='behavioral' className='report-card'>
              <h2>Behavioral Questions</h2>
              <ul className='qa-list'>
                {behavioralQuestions.length > 0 ? behavioralQuestions.map((item, idx) => (
                  <li key={`beh-${idx}`}>
                    <strong>{item.question}</strong>
                    <p>{item.intention}</p>
                    <p>{item.answer}</p>
                  </li>
                )) : <li>Questions will appear here after report generation.</li>}
              </ul>
            </section>}

            {activeSection === 'skills' && <section id='skills' className='report-grid'>
              <article className='report-card report-card--skills'>
                <h2>Skills Gap</h2>
                <ul className='tag-list'>
                  {skillsGap.length > 0 ? skillsGap.map((item, idx) => (
                    <li key={`gap-${idx}`}>
                      {item.skill} - {item.severity}
                    </li>
                  )) : <li>No skills gap data yet</li>}
                </ul>
              </article>
            </section>}

            {activeSection === 'recommendation' && <section id='recommendation' className='report-card'>
              <h2>Recommendation</h2>
              <p><span>Overall:</span> {recommendation.overallRecommendation || 'Not provided'}</p>
              <p><span>Strength:</span> {recommendation.recommendationStrength || 'Not provided'}</p>
            </section>}

            {activeSection === 'roadmap' && <section id='roadmap' className='report-card'>
              <h2>Weekly Roadmap</h2>
              {weeklyRoadmap.length > 0 ? (
                <div className='roadmap-list'>
                  {weeklyRoadmap.map((item, idx) => (
                    <article className='roadmap-item' key={`week-${idx}`}>
                      <h3>{item.week}</h3>
                      <p><span>Focus:</span> {item.focus}</p>
                      <ul>
                        {(item.tasks || []).map((task, taskIdx) => (
                          <li key={`task-${idx}-${taskIdx}`}>{task}</li>
                        ))}
                      </ul>
                      <p><span>Expected Outcome:</span> {item.expectedOutcome}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className='muted'>Roadmap will appear after AI analysis.</p>
              )}
            </section>}

            {activeSection === 'tips' && <section id='tips' className='report-card'>
              <h2>Preparation Tips</h2>
              <p className='muted'>{report.preparationTips || 'Tips will appear after AI analysis.'}</p>
            </section>}

            {activeSection === 'feedback' && <section id='feedback' className='report-card'>
              <h2>Overall Feedback</h2>
              <p className='muted'>{report.overallFeedback || 'Feedback summary will appear after AI analysis.'}</p>
            </section>}
          </div>
        </div>

        <footer className='interview-report__footer'>
          <Link to='/' className='back-link'>Back to Home</Link>
        </footer>
        </section>
      </section>
    </main>
  );
};

export default Interview;
