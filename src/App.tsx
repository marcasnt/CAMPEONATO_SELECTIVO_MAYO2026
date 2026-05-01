import { useState, useRef, useCallback, useEffect } from "react";
import {
  User,
  Dumbbell,
  Camera,
  Trophy,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Upload,
  Trash2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Scale,
  Ruler
} from "lucide-react";

const style = document.createElement("style");
style.textContent = `
  @keyframes float-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(245, 222, 179, 0.3); }
    50% { box-shadow: 0 0 40px rgba(245, 222, 179, 0.6); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes pulse-ring {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.5; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes slide-up-fade {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in-scale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes bounce-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  @keyframes glow-pulse {
    0%, 100% { border-color: rgba(245, 222, 179, 0.3); }
    50% { border-color: rgba(245, 222, 179, 0.8); }
  }
  @keyframes logo-glow-slow {
    0%, 100% { filter: drop-shadow(0 0 8px rgba(245,222,179,0.4)); }
    50% { filter: drop-shadow(0 0 25px rgba(245,222,179,0.7)); }
  }
  @keyframes shimmer-slow {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes pulse-slow {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  .animate-float-glow { animation: float-glow 4s ease-in-out infinite; }
  .animate-shimmer { background: linear-gradient(90deg, transparent 0%, rgba(245,222,179,0.1) 50%, transparent 100%); background-size: 200% 100%; animation: shimmer-slow 4s linear infinite; }
  .animate-pulse-ring { animation: pulse-ring 3s ease-in-out infinite; }
  .animate-slide-up { animation: slide-up-fade 0.5s ease-out forwards; }
  .animate-fade-scale { animation: fade-in-scale 0.4s ease-out forwards; }
  .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
  .animate-logo-glow { animation: logo-glow-slow 6s ease-in-out infinite; }
  .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
  .input-focus-glow:focus { box-shadow: 0 0 0 3px rgba(245, 222, 179, 0.3), 0 0 20px rgba(245, 222, 179, 0.1); }
  .btn-hover-glow:hover { box-shadow: 0 0 30px rgba(245, 222, 179, 0.4); transform: translateY(-2px); }
  .btn-hover-scale:hover { transform: scale(1.02); }
  .checkbox-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  .step_entrance { animation: slide-up-fade 0.6s ease-out forwards; opacity: 0; }
  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }
  .stagger-5 { animation-delay: 0.5s; }
  .progress-line-glow { background: linear-gradient(90deg, transparent, #f5deb3, transparent); background-size: 200% 100%; animation: shimmer-slow 5s ease-in-out infinite; }
  .card-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  .card-hover:hover { transform: translateY(-4px); box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
`;
document.head.appendChild(style);

// ============================================================
// CONFIGURATION & CONSTANTS
// ============================================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx6X9fmBVzIKBLb51aQzsA3EARnXrJ7Kq1S8c7hN9MVb4DL7bj62RoPj4Rn16cNf0jFog/exec";

const DEPARTAMENTOS_NI = [
  "Matagalpa", "Jinotega", "Estelí", "Madriz", "Nueva Segovia",
  "Managua", "León", "Chinandega", "Masaya", "Granada", "Carazo",
  "Rivas", "Boaco", "Chontales", "Río San Juan", "RACCN", "RACCS"
];

const CATEGORIAS_MASCULINAS = {
  "Fisicoculturismo": ["Hasta 65 Kg", "Hasta 70 Kg", "Hasta 75 Kg", "Hasta 80 Kg", "Hasta 85 Kg", "Más de 85 Kg"],
  "Men's Physique": ["Hasta 1.74 Mt", "Más de 1.74 Mt"],
  "Muscular Men's Physique": ["OPEN"],
  "Físico Clásico": ["Hasta 1.71 Mt", "Más de 1.71 Mt"],
  "Classic Physique": ["Hasta 1.71 Mt", "Más de 1.71 Mt"],
};

const CATEGORIAS_FEMENINAS = {
  "Women's Physique": ["Única Categoría"],
  "Bikini": ["Categoría Baja", "Categoría Alta"],
  "Body Fitness": ["Categoría Baja", "Categoría Alta"],
  "Wellness": ["Categoría Libre"],
};

const PASOS = [
  { title: "Personales", icon: <User className="w-5 h-5" /> },
  { title: "Deportiva", icon: <Dumbbell className="w-5 h-5" /> },
  { title: "Documentos", icon: <Camera className="w-5 h-5" /> },
  { title: "Categorías", icon: <Trophy className="w-5 h-5" /> },
  { title: "Confirmar", icon: <CheckCircle className="w-5 h-5" /> },
];

// ============================================================
// UTILITIES - OPTIMIZADAS
// ============================================================

const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL("image/jpeg", quality);
        resolve(base64.split(",")[1]);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ============================================================
// COMPONENTS
// ============================================================

const InputField = ({ label, icon: Icon, value, onChange, error, placeholder, type = "text", required = false }: any) => (
  <div className="mb-4 animate-slide-up">
    <label className="block text-gray-300 text-sm font-semibold mb-2 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-amber-500 shrink-0" />}
      {label} {required && <span className="text-amber-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-gray-900/50 border rounded-xl px-4 py-3 text-white placeholder-gray-500 transition-all focus:ring-2 focus:ring-amber-500 outline-none text-base sm:text-sm input-focus-glow ${error ? "border-red-500 animate-pulse-ring" : "border-gray-700 hover:border-amber-500/50"
          }`}
      />
    </div>
    {error && <p className="text-red-400 text-xs mt-1 animate-slide-up">{error}</p>}
  </div>
);

const PhotoUploader = ({ label, description, photo, onFileChange, onRemove, error, aspect = "square" }: any) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="mb-6 animate-slide-up">
      <label className="block text-gray-200 text-sm font-bold mb-1">{label}</label>
      <p className="text-gray-500 text-xs mb-3">{description}</p>

      {photo.preview ? (
        <div className="relative group animate-fade-scale">
          <div className={`overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-black animate-float-glow ${aspect === 'square' ? 'w-32 sm:w-40 h-32 sm:h-40' : 'w-full h-40 sm:h-48'}`}>
            <img src={photo.preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
              <button onClick={onRemove} className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 hover:scale-110 transition-all duration-200">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-2 text-green-400 text-xs flex items-center gap-1 animate-bounce-subtle">
            <CheckCircle className="w-3 h-3 shrink-0" /> Imagen cargada correctamente
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 hover:bg-amber-500/10 hover:scale-[1.02] card-hover ${error ? "border-red-500 bg-red-500/5" : "border-gray-700 hover:border-amber-500/50"
            }`}
        >
          <Upload className={`w-8 sm:w-10 h-8 sm:h-10 mx-auto mb-3 transition-transform duration-300 hover:scale-110 ${error ? 'text-red-400' : 'text-gray-500'}`} />
          <p className="text-gray-300 font-medium text-sm sm:text-base">Subir Imagen</p>
          <p className="text-gray-500 text-xs mt-1">Click para seleccionar (Max 5MB)</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileChange(file);
        }}
      />
      {error && <p className="text-red-400 text-xs mt-2 animate-slide-up">{error}</p>}
    </div>
  );
};

// ============================================================
// MAIN APPLICATION
// ============================================================
export default function App() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [form, setForm] = useState({
    nombreCompleto: "", cedula: "", fechaNacimiento: "",
    sexo: "", telefono: "", email: "",
    departamento: "Matagalpa", ciudad: "", direccion: "",
    atletaLibre: false, club: "", entrenador: "",
    pesoActual: "", estatura: "",
    contactoEmergencia: "", telefonoEmergencia: "",
    aceptaReglamento: false, aceptaHorario: false, autorizaDatos: false,
  });

  const [photos, setPhotos] = useState<any>({
    selfie: { file: null, preview: "", base64: "" },
    cedulaFrente: { file: null, preview: "", base64: "" },
    cedulaReverso: { file: null, preview: "", base64: "" },
  });

  const updateField = useCallback((name: string, value: any) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev: any) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, [errors]);

  const handlePhoto = useCallback(async (name: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev: any) => ({ ...prev, [name]: "El archivo es demasiado grande (Máx 10MB)" }));
      return;
    }
    const compressedBase64 = await compressImage(file, 800, 0.7);
    const preview = URL.createObjectURL(file);
    setPhotos((prev: any) => ({
      ...prev,
      [name]: { file, preview, base64: compressedBase64 }
    }));
    setErrors((prev: any) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const validateStep = () => {
    const newErrors: any = {};
    if (step === 0) {
      if (!form.nombreCompleto) newErrors.nombreCompleto = "El nombre es obligatorio";
      if (!form.cedula) newErrors.cedula = "La cédula es obligatoria";
      if (!form.fechaNacimiento) newErrors.fechaNacimiento = "Fecha requerida";
      if (!form.sexo) newErrors.sexo = "Seleccione sexo";
      if (!form.telefono) newErrors.telefono = "Teléfono requerido";
    } else if (step === 1) {
      if (!form.atletaLibre && !form.club) newErrors.club = "Especifique club o marque Atleta Libre";
      if (!form.pesoActual) newErrors.pesoActual = "Peso requerido";
      if (!form.estatura) newErrors.estatura = "Estatura requerida";
    } else if (step === 2) {
      if (!photos.selfie.file) newErrors.selfie = "Foto de perfil obligatoria";
      if (!photos.cedulaFrente.file) newErrors.cedulaFrente = "Foto de cédula obligatoria";
      if (!photos.cedulaReverso.file) newErrors.cedulaReverso = "Foto de reverso obligatoria";
    } else if (step === 4) {
      if (!form.contactoEmergencia) newErrors.contactoEmergencia = "Requerido";
      if (!form.telefonoEmergencia) newErrors.telefonoEmergencia = "Requerido";
      if (!form.aceptaReglamento) newErrors.aceptaReglamento = "Debe aceptar";
      if (!form.aceptaHorario) newErrors.aceptaHorario = "Debe aceptar";
      if (!form.autorizaDatos) newErrors.autorizaDatos = "Debe aceptar";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(s => s + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep(s => s - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        evento: "Campeonato Nacional Selectivo de Fisicoculturismo 2026 - Managua",
        fotoSelfie: {
          base64: photos.selfie.base64,
          name: "selfie.jpg",
          type: "image/jpeg"
        },
        fotoCedulaFrente: {
          base64: photos.cedulaFrente.base64,
          name: "cedula_frente.jpg",
          type: "image/jpeg"
        },
        fotoCedulaReverso: {
          base64: photos.cedulaReverso.base64,
          name: "cedula_reverso.jpg",
          type: "image/jpeg"
        },
        timestamp: new Date().toLocaleString("es-NI", { timeZone: "America/Managua" })
      };

      // Simulating fetch to GAS
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(payload)
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Hubo un problema al enviar los datos. Por favor intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-900 border border-amber-500/30 rounded-3xl p-8 text-center shadow-2xl">
          <img
            src="https://fenifisc.com/wp-content/uploads/2024/12/FENIFISC-OFICIAL.webp"
            alt="FENIFISC"
            className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-amber-500/40 bg-gray-800 p-1 object-contain"
            loading="lazy"
            decoding="async"
            width="80"
            height="80"
          />
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20 absolute -right-10 -top-10 animate-bounce-subtle">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 animate-slide-up stagger-1">¡Inscripción Exitosa!</h2>
          <p className="text-gray-400 mb-8 animate-slide-up stagger-2">
            Tu registro para el Campeonato Nacional Selectivo de Fisicoculturismo 2026 ha sido procesado. Te esperamos el sábado 23 de mayo a las 5:00 PM.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-2xl transition-all btn-hover-glow animate-slide-up stagger-3"
          >
            Finalizar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-amber-500/30">
      {/* Background Decor - Estilo Federativo FENIFISC */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradiente sutil profesional */}
        <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-950 to-black" />

        {/* Elementos decorativos sutiles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/3 rounded-full" />

        {/* Líneas horizontales sutiles */}
        <div className="absolute top-1/4 left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-500/10 to-transparent" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-500/10 to-transparent" />

        {/* Esquinas decorativas */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-500/20" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500/20" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/20" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-500/20" />
      </div>

      {/* Header - Responsive */}
      <header className="relative pt-8 sm:pt-12 pb-6 sm:pb-8 px-3 sm:px-4 text-center">
        {/* ALERTA FECHA LÍMITE */}
        <div className="relative max-w-4xl mx-auto mb-4 sm:mb-6">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-start sm:items-center gap-3 sm:gap-4 animate-pulse">
            <AlertCircle className="w-5 sm:w-6 h-5 sm:h-6 text-red-500 shrink-0 mt-0.5 sm:mt-0" />
            <div className="text-left">
              <h3 className="text-red-400 font-bold text-xs sm:text-sm">FECHA LÍMITE DE INSCRIPCIONES</h3>
              <p className="text-red-300 text-xs mt-1 leading-relaxed">
                Las inscripciones cierran el <strong>lunes 18 de mayo de 2026</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="relative inline-flex justify-center w-full mb-6 sm:mb-8 animate-fade-scale">
          <div className="absolute inset-0 flex justify-center">
            <div className="w-28 sm:w-40 h-28 sm:h-40 bg-linear-to-br from-amber-400/10 via-amber-500/5 to-amber-600/10 rounded-full animate-pulse-slow" />
          </div>
          <img
            src="https://fenifisc.com/wp-content/uploads/2024/12/FENIFISC-OFICIAL.webp"
            alt="FENIFISC Logo"
            className="relative w-28 sm:w-36 h-28 sm:h-36 rounded-full border-2 sm:border-3 border-amber-500/40 p-1.5 sm:p-2 bg-gray-900/80 object-contain animate-logo-glow"
            loading="lazy"
            decoding="async"
            width="112"
            height="112"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
          <span className="text-[#F5DEB3] animate-slide-up stagger-1">CAMPEONATO NACIONAL</span>
          <br className="sm:hidden" />
          <span className="text-amber-500 block mt-1 sm:mt-0 animate-slide-up stagger-2">SELECTIVO FISICO CULTURISMO</span>
          <span className="block mt-1 text-amber-400 animate-slide-up stagger-3">2026</span>
          <span className="block mt-1 text-amber-300/80 text-lg sm:text-xl md:text-2xl animate-slide-up stagger-4">MANAGUA 2026</span>
        </h1>

      </header>

      {/* Main Content */}
      <main className="relative max-w-4xl mx-auto px-4 pb-20">

        {/* Progress Bar - Responsive with animations */}
        <div className="mb-8 sm:mb-10 overflow-x-auto animate-slide-up stagger-3">
          <div className="min-w-[600px] flex justify-between items-center bg-gray-900/50 p-3 sm:p-4 rounded-2xl border border-gray-800 animate-shimmer">
            {PASOS.map((p, i) => (
              <div key={i} className="flex flex-col items-center flex-1 relative px-1 group">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${i <= step ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30" : "bg-gray-800 text-gray-500 group-hover:bg-gray-700"
                  }`}>
                  {i < step ? <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" /> : p.icon}
                </div>
                <span className={`text-[8px] sm:text-[10px] mt-2 font-bold uppercase tracking-wider transition-colors duration-300 ${i <= step ? "text-amber-500" : "text-gray-600 group-hover:text-gray-400"}`}>{p.title}</span>
                {i < PASOS.length - 1 && (
                  <div className={`absolute top-4 sm:top-5 left-[55%] sm:left-[60%] w-[70%] sm:w-[80%] h-[2px] -z-10 transition-all duration-500 ${i < step ? "bg-amber-500 progress-line-glow" : "bg-gray-800"
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Container - Responsive */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 sm:p-6 md:p-10">

          {/* STEP 0: PERSONAL */}
          {step === 0 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="text-amber-500" /> Información Personal
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6">
                <InputField
                  label="Nombre Completo"
                  required
                  value={form.nombreCompleto}
                  onChange={(v: any) => updateField("nombreCompleto", v)}
                  error={errors.nombreCompleto}
                  placeholder="Ej: Juan Pérez Artola"
                />
                <InputField
                  label="Cédula de Identidad"
                  required
                  value={form.cedula}
                  onChange={(v: any) => updateField("cedula", v)}
                  error={errors.cedula}
                  placeholder="000-000000-0000X"
                />
                <InputField
                  label="Fecha de Nacimiento"
                  type="date"
                  required
                  value={form.fechaNacimiento}
                  onChange={(v: any) => updateField("fechaNacimiento", v)}
                  error={errors.fechaNacimiento}
                />
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Sexo *</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['Masculino', 'Femenino'].map(s => (
                      <button
                        key={s}
                        onClick={() => updateField("sexo", s.toLowerCase())}
                        className={`py-3 rounded-xl border transition-all ${form.sexo === s.toLowerCase()
                          ? "bg-amber-500/10 border-amber-500 text-amber-500"
                          : "border-gray-700 bg-gray-900/50 text-gray-400 hover:border-gray-600"
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {errors.sexo && <p className="text-red-400 text-xs mt-1">{errors.sexo}</p>}
                </div>
                <InputField
                  label="Teléfono WhatsApp"
                  icon={Phone}
                  required
                  value={form.telefono}
                  onChange={(v: any) => updateField("telefono", v)}
                  error={errors.telefono}
                  placeholder="8888-8888"
                />
                <InputField
                  label="Email"
                  icon={Mail}
                  type="email"
                  value={form.email}
                  onChange={(v: any) => updateField("email", v)}
                  placeholder="atleta@ejemplo.com"
                />
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" /> Departamento
                  </label>
                  <select
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    value={form.departamento}
                    onChange={(e) => updateField("departamento", e.target.value)}
                  >
                    {DEPARTAMENTOS_NI.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <InputField
                  label="Ciudad / Municipio"
                  value={form.ciudad}
                  onChange={(v: any) => updateField("ciudad", v)}
                  placeholder="Ej: Matagalpa"
                />
              </div>
            </div>
          )}

          {/* STEP 1: DEPORTIVA */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Dumbbell className="text-amber-500" /> Datos de Competencia
              </h2>
              <div className="mb-8">
                <button
                  onClick={() => updateField("atletaLibre", !form.atletaLibre)}
                  className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all ${form.atletaLibre ? "bg-amber-500/10 border-amber-500" : "bg-gray-900/50 border-gray-700"
                    }`}
                >
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${form.atletaLibre ? "bg-amber-500 border-amber-500" : "border-gray-500"
                    }`}>
                    {form.atletaLibre && <CheckCircle className="w-4 h-4 text-black" />}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white">Soy Atleta Libre</p>
                    <p className="text-gray-500 text-xs">No represento a ningún Team o Gimnasio</p>
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6">
                {!form.atletaLibre && (
                  <>
                    <InputField
                      label="Team / Gimnasio"
                      required
                      value={form.club}
                      onChange={(v: any) => updateField("club", v)}
                      error={errors.club}
                      placeholder="Nombre de tu gimnasio"
                    />
                    <InputField
                      label="Entrenador"
                      value={form.entrenador}
                      onChange={(v: any) => updateField("entrenador", v)}
                      placeholder="Nombre del coach"
                    />
                  </>
                )}
                <InputField
                  label="Peso Actual (Kg)"
                  icon={Scale}
                  required
                  value={form.pesoActual}
                  onChange={(v: any) => updateField("pesoActual", v)}
                  error={errors.pesoActual}
                  placeholder="Ej: 75"
                />
                <InputField
                  label="Estatura (Metros)"
                  icon={Ruler}
                  required
                  value={form.estatura}
                  onChange={(v: any) => updateField("estatura", v)}
                  error={errors.estatura}
                  placeholder="Ej: 1.70"
                />
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 mt-4 flex gap-4">
                <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                <p className="text-amber-200/70 text-xs leading-relaxed">
                  LUGAR: Polideportivo España. Fecha: Sábado 23 de mayo del 2026. Hora: 5:00 PM.
                  Pesaje: De 12:00 MD a 3:00 PM en el mismo lugar del evento.
                  Favor presentarse con puntualidad.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: DOCUMENTS */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Camera className="text-amber-500" /> Galería de Validación
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <PhotoUploader
                  label="Foto de Perfil (Selfie)"
                  description="Rostro descubierto y buena iluminación"
                  photo={photos.selfie}
                  onFileChange={(f: any) => handlePhoto("selfie", f)}
                  onRemove={() => setPhotos((p: any) => ({ ...p, selfie: { file: null, preview: "", base64: "" } }))}
                  error={errors.selfie}
                />
                <PhotoUploader
                  label="Cédula (Frente)"
                  description="Asegúrese que los datos sean legibles"
                  photo={photos.cedulaFrente}
                  aspect="card"
                  onFileChange={(f: any) => handlePhoto("cedulaFrente", f)}
                  onRemove={() => setPhotos((p: any) => ({ ...p, cedulaFrente: { file: null, preview: "", base64: "" } }))}
                  error={errors.cedulaFrente}
                />
                <PhotoUploader
                  label="Cédula (Reverso)"
                  description="Fotografía del reverso del documento"
                  photo={photos.cedulaReverso}
                  aspect="card"
                  onFileChange={(f: any) => handlePhoto("cedulaReverso", f)}
                  onRemove={() => setPhotos((p: any) => ({ ...p, cedulaReverso: { file: null, preview: "", base64: "" } }))}
                  error={errors.cedulaReverso}
                />
              </div>
            </div>
          )}

          {/* STEP 3: CATEGORIES INFO */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="text-amber-500" /> Categorías Oficiales
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Seleccionarás tu categoría definitiva el día del pesaje. Aquí puedes ver la oferta oficial:
              </p>

              {/* REGLAMENTO IMPORTANTE */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 mb-8">
                <h3 className="text-amber-400 font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  REGLAMENTO OFICIAL IFBB
                </h3>
                <div className="space-y-3 text-sm text-amber-200/80">
                  <p className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Esta Competencia estará regida por las reglas y reglamentos de la Federación Internacional de Fitness y Fisicoculturismo (IFBB).</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Cualquier atleta que se presente después de la hora estipulada para el pesaje, no tendrá derecho de ser pesado y pierde todo derecho de competir.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>A los atletas que se inscriben para participar en CLASSIC PHYSIQUE, se le hace de su conocimiento que el requisito para poder participar en dicha modalidad es hacer el VACIO ABDOMINAL que se les pedirá en la mesa de inscripción y pesaje, en el entendido que quienes no pueden hacer el Vacío Abdominal, pierden el derecho de participar en dicha modalidad.</span>
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-amber-500 font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full" /> Rama Masculina
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.keys(CATEGORIAS_MASCULINAS).map(cat => (
                      <div key={cat} className="bg-gray-800/30 p-4 rounded-2xl border border-gray-700">
                        <p className="font-bold text-white mb-2">{cat}</p>
                        <div className="space-y-1">
                          {(CATEGORIAS_MASCULINAS as any)[cat].map((s: string) => (
                            <p key={s} className="text-gray-500 text-xs">• {s}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-pink-500 font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-pink-500 rounded-full" /> Rama Femenina
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.keys(CATEGORIAS_FEMENINAS).map(cat => (
                      <div key={cat} className="bg-gray-800/30 p-4 rounded-2xl border border-gray-700">
                        <p className="font-bold text-white mb-2">{cat}</p>
                        <div className="space-y-1">
                          {(CATEGORIAS_FEMENINAS as any)[cat].map((s: string) => (
                            <p key={s} className="text-gray-500 text-xs">• {s}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle className="text-amber-500" /> Finalizar Registro
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <InputField
                  label="Contacto de Emergencia"
                  required
                  value={form.contactoEmergencia}
                  onChange={(v: any) => updateField("contactoEmergencia", v)}
                  error={errors.contactoEmergencia}
                  placeholder="Nombre de familiar"
                />
                <InputField
                  label="Teléfono Emergencia"
                  required
                  value={form.telefonoEmergencia}
                  onChange={(v: any) => updateField("telefonoEmergencia", v)}
                  error={errors.telefonoEmergencia}
                  placeholder="8888-8888"
                />
              </div>

              <div className="space-y-4">
                <p className="text-amber-500 text-sm font-semibold mb-3">Debe marcar los tres para continuar:</p>
                {[
                  { id: "aceptaReglamento", text: "Acepto el reglamento oficial de la IFBB y FENIFISC." },
                  { id: "aceptaHorario", text: "Confirmo que el pesaje es de 12:00 MD a 3:00 PM en el Polideportivo España y el evento inicia a las 5:00 PM. Seré puntual, de lo contrario seré penalizado." },
                  { id: "autorizaDatos", text: "Autorizo el uso de mi imagen y datos para fines del evento, y FENIFISC estime conveniente." }
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${(form as any)[item.id] ? "bg-green-500/10 border-green-500" : "bg-gray-900/50 border-gray-700 hover:border-gray-600"
                      }`}
                  >
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${(form as any)[item.id] ? "bg-green-500 border-green-500" : "border-gray-500"}`}>
                      {(form as any)[item.id] && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={(form as any)[item.id]}
                      onChange={(e) => updateField(item.id, e.target.checked)}
                    />
                    <span className="text-sm text-gray-300 leading-snug">{item.text}</span>
                  </label>
                ))}
              </div>
              {(errors.aceptaReglamento || errors.aceptaHorario || errors.autorizaDatos) && (
                <p className="text-red-400 text-sm mt-3 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Debe aceptar los tres términos para finalizar la inscripción
                </p>
              )}
            </div>
          )}

          {/* Navigation Buttons - With animations and hover effects */}
          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
            {step > 0 && (
              <button
                onClick={handleBack}
                disabled={loading}
                className="flex-1 sm:max-w-[180px] px-6 py-4 sm:px-8 sm:py-5 rounded-xl sm:rounded-2xl border border-gray-700 font-bold hover:bg-gray-800 hover:border-amber-500/50 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 text-base sm:text-lg btn-hover-scale"
              >
                <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6 transition-transform hover:-translate-x-1" /> <span>Atrás</span>
              </button>
            )}

            {step < PASOS.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex-1 px-8 py-4 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-3 ml-auto sm:max-w-[300px] text-base sm:text-lg btn-hover-glow btn-hover-scale"
              >
                Siguiente <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6 transition-transform hover:translate-x-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-8 py-4 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold hover:from-amber-500 hover:to-amber-400 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 ml-auto sm:max-w-[300px] text-base sm:text-lg disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 sm:w-7 h-6 sm:h-7 border-4 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Finalizar Inscripción <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6" /></>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer Info - Responsive */}
        <footer className="mt-8 sm:mt-12 text-center text-gray-600 text-xs px-4">
          <p className="mb-2 leading-relaxed">Federación Nicaragüense de Fisicoculturismo (FENIFISC) • IND • Asociación Departamental de Managua</p>
          <p>© 2026 Todos los derechos reservados</p>
        </footer>
      </main>
    </div>
  );
}
