import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Download, Calendar, ExternalLink, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import API_URL from '../config/api';

export const CertificateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [certData, setCertData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!id) return;
      try {
        const res = await fetch(`${API_URL}/api/certificates/verify/${id}`);
        const data = await res.json();
        if (res.ok && data.valid) {
          setCertData(data);
        } else {
          setError(data.error || 'Failed to load certificate');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching certificate from verified database.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (certificateRef.current) {
      // Hide buttons or download references if any inside the capture area
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2.5, // High resolution crisp PDF render
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');

      // Create PDF matching canvas dimensions in landscape mode
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2.5, canvas.height / 2.5],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2.5, canvas.height / 2.5);
      pdf.save(`typesprint-certificate-${id}.pdf`);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-theme-sub">
        <RefreshCw className="animate-spin mb-4" size={32} />
        <p>Fetching verified certificate...</p>
      </div>
    );
  }

  if (error || !certData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
        <ShieldCheck className="text-theme-error mb-4" size={48} />
        <h2 className="text-2xl font-bold text-theme-text">Certificate Not Found</h2>
        <p className="text-sm text-theme-sub mt-2 max-w-sm">
          {error || 'This certificate does not exist or has been revoked.'}
        </p>
        <Link to="/verify" className="mt-6 px-5 py-2.5 rounded-xl bg-theme-main text-black font-semibold text-sm">
          Go to Verification
        </Link>
      </div>
    );
  }

  // Create verification URL to embed in QR code
  const verifyUrl = `${window.location.origin}/verify?id=${id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    verifyUrl
  )}`;

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col items-center">
      {/* Actions header */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-theme-sub text-sm">
          <ShieldCheck className="text-theme-correct" size={16} /> Verified Authenticity
        </div>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-theme-main text-black text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Download size={16} /> Download PDF Certificate
        </button>
      </div>

      {/* Main Certificate Mockup (Landscape ratio) */}
      <div
        ref={certificateRef}
        className="w-full max-w-4xl bg-stone-900 border-[10px] border-yellow-700/40 rounded-3xl p-10 md:p-14 text-stone-100 flex flex-col justify-between shadow-2xl relative overflow-hidden aspect-[1.5/1]"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(20, 20, 20, 0.95), rgba(10, 10, 10, 0.99))',
        }}
      >
        {/* Ornate corners */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-yellow-600/30" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-yellow-600/30" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-yellow-600/30" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-yellow-600/30" />

        {/* Certificate Content Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 text-yellow-600 font-extrabold text-2xl tracking-tight">
              <span>⚡</span> TypeSprint
            </div>
            <p className="text-stone-400 text-xs font-mono mt-1">CERTIFICATE OF KEYBOARD SPRINT</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-400 border border-yellow-600/20 px-3 py-1.5 rounded-lg bg-black/40">
            <ShieldCheck size={14} className="text-emerald-500" />
            VERIFIED RECORD
          </div>
        </div>

        {/* Certificate Body */}
        <div className="my-auto py-4 text-center md:text-left">
          <p className="text-stone-400 text-sm md:text-base uppercase tracking-widest font-medium">
            This certifies that
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mt-3 font-sans border-b border-stone-800 pb-3">
            {certData.displayName}
          </h2>
          <p className="text-stone-400 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
            has successfully completed a high-speed professional keyboard typing evaluation, demonstrating proficient muscle coordination and key accuracy under controlled testing protocols.
          </p>
        </div>

        {/* Certificate Footer / Statistics */}
        <div className="flex flex-col md:flex-row justify-between items-end border-t border-stone-800 pt-6 gap-6">
          <div className="grid grid-cols-3 gap-6 text-left w-full md:w-auto">
            <div>
              <p className="text-[10px] text-stone-500 uppercase font-semibold">Net Typing Speed</p>
              <p className="text-xl md:text-2xl font-bold font-mono text-yellow-600 mt-0.5">{Math.round(certData.wpmNet)} WPM</p>
            </div>
            <div>
              <p className="text-[10px] text-stone-500 uppercase font-semibold">Accuracy Ratio</p>
              <p className="text-xl md:text-2xl font-bold font-mono text-stone-200 mt-0.5">{Math.round(certData.accuracy)}%</p>
            </div>
            <div>
              <p className="text-[10px] text-stone-500 uppercase font-semibold">Gross Speed</p>
              <p className="text-xl md:text-2xl font-bold font-mono text-stone-400 mt-0.5">{Math.round(certData.wpmGross)} WPM</p>
            </div>
          </div>

          <div className="flex items-center gap-6 self-center md:self-end">
            {/* Certificate Meta Details */}
            <div className="text-right text-stone-500 text-xs font-mono flex flex-col gap-1">
              <div>ID: <span className="text-stone-300 font-semibold">{certData.id}</span></div>
              <div className="flex items-center justify-end gap-1.5">
                <Calendar size={12} />
                <span>Date: {new Date(certData.issuedDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Verification QR Code */}
            <div className="bg-white p-1.5 rounded-lg flex-shrink-0" title="Scan to Verify">
              <img
                src={qrCodeUrl}
                alt="Verification QR"
                className="w-16 h-16 md:w-20 md:h-20"
                crossOrigin="anonymous"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Verify verification link */}
      <p className="text-xs text-theme-sub mt-4 text-center">
        This is a permanent digital record. Anyone can verify this certificate online by browsing to{' '}
        <a href={verifyUrl} className="text-theme-main inline-flex items-center gap-0.5 hover:underline">
          {verifyUrl} <ExternalLink size={10} />
        </a>
      </p>
    </div>
  );
};
export default CertificateDetail;
