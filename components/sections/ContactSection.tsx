import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import { companyInfo, serviceList } from '../../data/company';
import { DhakaGlobe3D } from '../3d/DhakaGlobe3D';

export const ContactSection: React.FC = () => {
  const { t } = useLocale();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
    hp_company_url: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please provide your full name (at least 2 characters).';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!formData.service) {
      errors.service = 'Please choose a primary service.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Please share a brief project summary (at least 10 characters).';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          service: formData.service,
          message: formData.message,
          honeypot: formData.hp_company_url,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          company: '',
          service: '',
          message: '',
          hp_company_url: '',
        });
      } else {
        setStatus('error');
        setErrorMessage(result.error || t.contact.form.errorDesc);
      }
    } catch {
      setStatus('error');
      setErrorMessage(t.contact.form.errorDesc);
    }
  };

  return (
    <section id="contact" className="py-24 section-alt border-t border-[var(--border-subtle)] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-4">
            {t.contact.badge}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-theme-primary mb-4">
            {t.contact.title}
          </h2>
          <p className="text-base sm:text-lg text-theme-secondary mb-4">
            {t.contact.subtitle}
          </p>

          {/* Timezone & Response note (editable placeholder) */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">
            <Clock className="w-4 h-4 text-cyan-500 shrink-0" />
            <span>{t.contact.responseTimePlaceholder}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Interactive 3D Dhaka Globe & Direct Contacts */}
          <div className="lg:col-span-5 space-y-6">
            {/* Draggable 3D Globe with Single Marker on Dhaka */}
            <div className="card-theme p-6 rounded-2xl shadow-sm flex flex-col items-center overflow-hidden">
              <DhakaGlobe3D />
            </div>

            <div className="card-theme p-8 rounded-2xl shadow-sm space-y-6">
              <h3 className="font-display text-xl font-bold text-theme-primary mb-4">
                {t.contact.direct.office}
              </h3>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-theme-muted uppercase tracking-wider">Email Inquiry</p>
                  <a
                    href={`mailto:${companyInfo.email}`}
                    className="text-base font-semibold text-theme-primary hover:text-cyan-500 transition-colors"
                  >
                    {companyInfo.email}
                  </a>
                </div>
              </div>

              {/* WhatsApp Direct */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-theme-muted uppercase tracking-wider">WhatsApp & Direct Call</p>
                  <a
                    href={companyInfo.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold text-theme-primary hover:text-emerald-500 transition-colors block"
                  >
                    {companyInfo.phone}
                  </a>
                  <a
                    href={companyInfo.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-emerald-500 hover:underline mt-1"
                  >
                    <span>{t.contact.direct.whatsappLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Physical Office Address */}
              <div className="flex items-start gap-4 pt-2 border-t border-[var(--border-subtle)]">
                <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] text-theme-muted shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-theme-muted uppercase tracking-wider">Office Address</p>
                  <p className="text-sm font-medium text-theme-primary mt-0.5 leading-relaxed">
                    {companyInfo.address}, {companyInfo.city} {companyInfo.postalCode}, {companyInfo.country}
                  </p>
                </div>
              </div>
            </div>

            {/* International Remote Collaboration Guarantee */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
              <h4 className="font-display font-bold text-sm tracking-wide text-cyan-400 uppercase mb-2">
                International Working Protocol
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Whether you are in North America, the UK, Europe, Australia, or the Gulf, our Dhaka team structures daily async updates, milestones, and video handoffs around your business hours.
              </p>
            </div>
          </div>

          {/* Right: Interactive Contact Form with Animated Focus States */}
          <div className="lg:col-span-7">
            <div className="card-theme p-8 sm:p-10 rounded-2xl shadow-sm">
              {status === 'success' ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-theme-primary">
                    {t.contact.form.successTitle}
                  </h3>
                  <p className="text-sm text-theme-secondary max-w-md mx-auto">
                    {t.contact.form.successDesc}
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot field */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="hp_company_url">Do not fill this</label>
                    <input
                      type="text"
                      id="hp_company_url"
                      name="hp_company_url"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.hp_company_url}
                      onChange={(e) => setFormData({ ...formData, hp_company_url: e.target.value })}
                    />
                  </div>

                  {status === 'error' && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{errorMessage || t.contact.form.errorDesc}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 transition-colors ${
                        focusedField === 'name' ? 'text-cyan-500' : 'text-theme-primary'
                      }`}>
                        {t.contact.form.nameLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t.contact.form.namePlaceholder}
                        value={formData.name}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                        }}
                        className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-card-subtle)] border text-theme-primary placeholder:text-theme-muted text-sm transition-all ${
                          fieldErrors.name
                            ? 'border-rose-500 ring-1 ring-rose-500/50'
                            : focusedField === 'name'
                            ? 'border-cyan-500 ring-2 ring-cyan-500/30 shadow-sm'
                            : 'border-[var(--border-subtle)]'
                        } focus:outline-none`}
                      />
                      {fieldErrors.name && (
                        <p className="text-xs text-rose-500 mt-1">{fieldErrors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 transition-colors ${
                        focusedField === 'email' ? 'text-cyan-500' : 'text-theme-primary'
                      }`}>
                        {t.contact.form.emailLabel} *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder={t.contact.form.emailPlaceholder}
                        value={formData.email}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                        }}
                        className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-card-subtle)] border text-theme-primary placeholder:text-theme-muted text-sm transition-all ${
                          fieldErrors.email
                            ? 'border-rose-500 ring-1 ring-rose-500/50'
                            : focusedField === 'email'
                            ? 'border-cyan-500 ring-2 ring-cyan-500/30 shadow-sm'
                            : 'border-[var(--border-subtle)]'
                        } focus:outline-none`}
                      />
                      {fieldErrors.email && (
                        <p className="text-xs text-rose-500 mt-1">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Company (Optional) */}
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 transition-colors ${
                        focusedField === 'company' ? 'text-cyan-500' : 'text-theme-primary'
                      }`}>
                        {t.contact.form.companyLabel}
                      </label>
                      <input
                        type="text"
                        placeholder={t.contact.form.companyPlaceholder}
                        value={formData.company}
                        onFocus={() => setFocusedField('company')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-card-subtle)] border text-theme-primary placeholder:text-theme-muted text-sm transition-all ${
                          focusedField === 'company'
                            ? 'border-cyan-500 ring-2 ring-cyan-500/30 shadow-sm'
                            : 'border-[var(--border-subtle)]'
                        } focus:outline-none`}
                      />
                    </div>

                    {/* Service Select */}
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 transition-colors ${
                        focusedField === 'service' ? 'text-cyan-500' : 'text-theme-primary'
                      }`}>
                        {t.contact.form.serviceLabel} *
                      </label>
                      <select
                        name="service"
                        required
                        value={formData.service}
                        onFocus={() => setFocusedField('service')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => {
                          setFormData({ ...formData, service: e.target.value });
                          if (fieldErrors.service) setFieldErrors({ ...fieldErrors, service: '' });
                        }}
                        className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-card-subtle)] border text-theme-primary text-sm transition-all ${
                          fieldErrors.service
                            ? 'border-rose-500 ring-1 ring-rose-500/50'
                            : focusedField === 'service'
                            ? 'border-cyan-500 ring-2 ring-cyan-500/30 shadow-sm'
                            : 'border-[var(--border-subtle)]'
                        } focus:outline-none`}
                      >
                        <option value="">{t.contact.form.serviceDefault}</option>
                        {serviceList.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.service && (
                        <p className="text-xs text-rose-500 mt-1">{fieldErrors.service}</p>
                      )}
                    </div>
                  </div>

                  {/* Project Details Message */}
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 transition-colors ${
                      focusedField === 'message' ? 'text-cyan-500' : 'text-theme-primary'
                    }`}>
                      {t.contact.form.messageLabel} *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder={t.contact.form.messagePlaceholder}
                      value={formData.message}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-card-subtle)] border text-theme-primary placeholder:text-theme-muted text-sm transition-all ${
                        fieldErrors.message
                          ? 'border-rose-500 ring-1 ring-rose-500/50'
                          : focusedField === 'message'
                          ? 'border-cyan-500 ring-2 ring-cyan-500/30 shadow-sm'
                          : 'border-[var(--border-subtle)]'
                      } focus:outline-none`}
                    />
                    {fieldErrors.message && (
                      <p className="text-xs text-rose-500 mt-1">{fieldErrors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:via-sky-500 hover:to-blue-500 shadow-md shadow-cyan-600/20 hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {status === 'submitting' ? (
                      <span>{t.contact.form.sending}</span>
                    ) : (
                      <>
                        <span>{t.contact.form.submitBtn}</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
