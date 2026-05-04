import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../style/home.scss"

const Home = () => {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!resume) {
      setError('Please upload your resume PDF before generating the report.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('selfDescription', selfDescription);
      formData.append('jobDescription', jobDescription);

      const response = await fetch('http://localhost:3000/api/interview', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to generate interview report');
      }

      const report = result.data || result.report || result;
      const interviewId = report?._id || report?.id || 'new';

      navigate(`/interview/${interviewId}`, {
        state: { report }
      });
    } catch (err) {
      setError(err.message || 'Failed to generate interview report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResumePdf = async () => {
    setError('');

    if (!resume || !selfDescription || !jobDescription) {
      setError('Please provide resume PDF, self-description, and job description.');
      return;
    }

    try {
      setResumeLoading(true);

      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('selfDescription', selfDescription);
      formData.append('jobDescription', jobDescription);

      const response = await fetch('http://localhost:3000/api/ai/resume-pdf', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        let message = 'Failed to generate resume PDF';
        try {
          const body = await response.json();
          message = body.message || message;
        } catch {
          // ignore non-json bodies
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'tailored-resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Failed to generate resume PDF. Please try again.');
    } finally {
      setResumeLoading(false);
    }
  };

  return (
    <main className='home'>
      <div className='home__glow home__glow--one' />
      <div className='home__glow home__glow--two' />

      <section className='home__panel'>
        <header className='home__header'>
          <p className='home__eyebrow'>AI Interview Studio</p>
          <h1>Generate Your Interview Report</h1>
          <p className='home__subtitle'>
            Add your target job, self-introduction, and resume PDF to get a focused interview analysis.
          </p>
        </header>

        <form className='interview-form' onSubmit={handleSubmit}>
          <div className='interview-form__grid'>
            <div className='interview-form__field'>
              <label htmlFor='jobDescription'>Job Description</label>
              <textarea
                name='jobDescription'
                id='jobDescription'
                placeholder='Paste the job description here...'
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
              />
            </div>

            <div className='interview-form__field'>
              <label htmlFor='selfDescription'>Self Description</label>
              <textarea
                name='selfDescription'
                id='selfDescription'
                placeholder='Write a brief self-description here...'
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <div className='interview-form__upload'>
            <label htmlFor='resume'>Resume (PDF)</label>
            <input
              type='file'
              id='resume'
              name='resume'
              accept='.pdf'
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              required
            />
          </div>

          {error && <p className='interview-form__error'>{error}</p>}

          <div className='home__actions'>
            <button className='generate-btn' type='submit' disabled={loading || resumeLoading}>
              {loading ? 'Generating Report...' : 'Generate Interview Report'}
            </button>
            <button className='generate-btn generate-btn--secondary' type='button' onClick={handleResumePdf} disabled={loading || resumeLoading}>
              {resumeLoading ? 'Generating Resume PDF...' : 'Generate Resume PDF'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default Home
