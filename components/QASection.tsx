'use client'

// Q&A section for blog posts — users can ask and answer questions
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Question, Answer } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface QASectionProps {
  blogSlug: string
}

export default function QASection({ blogSlug }: QASectionProps) {
  const [user, setUser] = useState<User | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  // Track which question has the answer form open
  const [answeringId, setAnsweringId] = useState<string | null>(null)
  const [newAnswer, setNewAnswer] = useState('')
  // Track which questions are expanded to show answers
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  // Load user and questions on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    loadQuestions()
    return () => subscription.unsubscribe()
  }, [blogSlug])

  // Fetch all questions + answers for this blog post
  async function loadQuestions() {
    setLoading(true)
    const { data: questionsData } = await supabase
      .from('questions')
      .select('*')
      .eq('blog_slug', blogSlug)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })

    if (questionsData) {
      // Load answers for each question
      const questionIds = questionsData.map(q => q.id)
      const { data: answersData } = await supabase
        .from('answers')
        .select('*')
        .in('question_id', questionIds.length > 0 ? questionIds : ['none'])
        .order('created_at', { ascending: true })

      // Attach answers to their questions
      const questionsWithAnswers = questionsData.map(q => ({
        ...q,
        answers: (answersData || []).filter(a => a.question_id === q.id),
      }))

      setQuestions(questionsWithAnswers)
    }
    setLoading(false)
  }

  // Sign in with Google
  async function handleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    })
  }

  // Submit a new question
  async function handleSubmitQuestion(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !newQuestion.trim()) return

    setSubmitting(true)
    const { error } = await supabase.from('questions').insert({
      blog_slug: blogSlug,
      user_id: user.id,
      user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      user_avatar: user.user_metadata?.avatar_url || null,
      question_text: newQuestion.trim(),
    })

    if (!error) {
      setNewQuestion('')
      await loadQuestions()
    }
    setSubmitting(false)
  }

  // Submit an answer to a question
  async function handleSubmitAnswer(questionId: string) {
    if (!user || !newAnswer.trim()) return

    setSubmitting(true)
    const { error } = await supabase.from('answers').insert({
      question_id: questionId,
      user_id: user.id,
      user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      user_avatar: user.user_metadata?.avatar_url || null,
      answer_text: newAnswer.trim(),
    })

    if (!error) {
      setNewAnswer('')
      setAnsweringId(null)
      await loadQuestions()
      // Auto-expand this question to show the new answer
      setExpandedIds(prev => { const next = new Set(prev); next.add(questionId); return next })
    }
    setSubmitting(false)
  }

  // Delete a question (only your own)
  async function handleDeleteQuestion(questionId: string) {
    if (!confirm('Delete this question and all its answers?')) return
    await supabase.from('questions').delete().eq('id', questionId)
    await loadQuestions()
  }

  // Delete an answer (only your own)
  async function handleDeleteAnswer(answerId: string) {
    if (!confirm('Delete this answer?')) return
    await supabase.from('answers').delete().eq('id', answerId)
    await loadQuestions()
  }

  // Toggle expand/collapse answers for a question
  function toggleExpanded(questionId: string) {
    setExpandedIds(prev => {
      const next = new Set(Array.from(prev))
      if (next.has(questionId)) next.delete(questionId)
      else next.add(questionId)
      return next
    })
  }

  // Format relative time (e.g., "2 hours ago", "3 days ago")
  function timeAgo(dateStr: string): string {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    const months = Math.floor(days / 30)
    return `${months}mo ago`
  }

  return (
    <section className="max-w-3xl mx-auto mt-16 mb-8">
      <div className="border-t-2 border-gray-200 pt-10">
        <h2 className="text-2xl font-display font-bold text-brand-navy mb-2">
          Questions &amp; Answers
        </h2>
        <p className="text-brand-slate text-sm mb-8">
          Have a question about this topic? Ask below and the community will help.
        </p>

        {/* Ask a question form */}
        {user ? (
          <form onSubmit={handleSubmitQuestion} className="mb-10">
            <div className="flex items-start gap-3">
              {user.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  className="w-9 h-9 rounded-full mt-1 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="flex-1">
                <textarea
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  placeholder="Ask a question about this topic..."
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={submitting || !newQuestion.trim()}
                    className="px-5 py-2 bg-brand-navy text-white text-sm font-bold rounded-lg hover:bg-brand-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Posting...' : 'Post Question'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-10 p-6 bg-brand-sand rounded-xl text-center">
            <p className="text-brand-slate text-sm mb-3">Sign in to ask or answer questions</p>
            <button
              onClick={handleSignIn}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        )}

        {/* Questions list */}
        {loading ? (
          <div className="text-center py-8 text-brand-slate text-sm">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="text-center py-8 text-brand-slate text-sm">
            No questions yet. Be the first to ask!
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map(question => (
              <div key={question.id} className="bg-white border border-gray-200 rounded-xl p-5">
                {/* Question header */}
                <div className="flex items-start gap-3">
                  {question.user_avatar ? (
                    <img
                      src={question.user_avatar}
                      alt=""
                      className="w-8 h-8 rounded-full mt-0.5 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                      {question.user_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-brand-navy">
                        {question.user_name}
                      </span>
                      <span className="text-xs text-brand-slate">
                        {timeAgo(question.created_at)}
                      </span>
                      {question.is_pinned && (
                        <span className="text-xs bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full font-medium">
                          Pinned
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-800 mt-1.5 leading-relaxed">
                      {question.question_text}
                    </p>

                    {/* Action buttons */}
                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => {
                          toggleExpanded(question.id)
                          if (!expandedIds.has(question.id) && !answeringId) {
                            // If expanding and no answer form open, show it
                          }
                        }}
                        className="text-xs text-brand-slate hover:text-brand-blue transition-colors"
                      >
                        {(question.answers?.length || 0)} {(question.answers?.length || 0) === 1 ? 'answer' : 'answers'}
                        {expandedIds.has(question.id) ? ' ▲' : ' ▼'}
                      </button>

                      {user && (
                        <button
                          onClick={() => {
                            setAnsweringId(answeringId === question.id ? null : question.id)
                            setNewAnswer('')
                            // Auto-expand when answering
                            if (answeringId !== question.id) {
                              setExpandedIds(prev => { const next = new Set(Array.from(prev)); next.add(question.id); return next })
                            }
                          }}
                          className="text-xs text-brand-blue hover:text-brand-navy transition-colors font-medium"
                        >
                          Answer
                        </button>
                      )}

                      {/* Delete button — only for your own questions */}
                      {user && user.id === question.user_id && (
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-xs text-red-400 hover:text-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Answers (expanded) */}
                {expandedIds.has(question.id) && question.answers && question.answers.length > 0 && (
                  <div className="mt-4 ml-11 space-y-4 border-l-2 border-gray-100 pl-4">
                    {question.answers.map(answer => (
                      <div key={answer.id} className="flex items-start gap-2.5">
                        {answer.user_avatar ? (
                          <img
                            src={answer.user_avatar}
                            alt=""
                            className="w-6 h-6 rounded-full mt-0.5 flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">
                            {answer.user_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-brand-navy">
                              {answer.user_name}
                            </span>
                            <span className="text-[11px] text-brand-slate">
                              {timeAgo(answer.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                            {answer.answer_text}
                          </p>
                          {/* Delete answer — only for your own */}
                          {user && user.id === answer.user_id && (
                            <button
                              onClick={() => handleDeleteAnswer(answer.id)}
                              className="text-[11px] text-red-400 hover:text-red-600 transition-colors mt-1"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Answer form (when "Answer" is clicked) */}
                {answeringId === question.id && user && (
                  <div className="mt-4 ml-11 pl-4 border-l-2 border-brand-blue/30">
                    <div className="flex items-start gap-2.5">
                      {user.user_metadata?.avatar_url && (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt=""
                          className="w-6 h-6 rounded-full mt-1 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="flex-1">
                        <textarea
                          value={newAnswer}
                          onChange={e => setNewAnswer(e.target.value)}
                          placeholder="Write your answer..."
                          className="w-full p-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                          rows={2}
                        />
                        <div className="flex gap-2 justify-end mt-1.5">
                          <button
                            onClick={() => { setAnsweringId(null); setNewAnswer('') }}
                            className="px-3 py-1.5 text-xs text-brand-slate hover:text-brand-navy transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSubmitAnswer(question.id)}
                            disabled={submitting || !newAnswer.trim()}
                            className="px-4 py-1.5 bg-brand-navy text-white text-xs font-bold rounded-lg hover:bg-brand-blue transition-colors disabled:opacity-50"
                          >
                            {submitting ? 'Posting...' : 'Post Answer'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
