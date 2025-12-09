import { useState } from 'react';
import { UserPlus, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

interface SignupProps {
  onSignup: () => void;
  onBackToLogin: () => void;
}

export function Signup({ onSignup, onBackToLogin }: SignupProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation basique
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    if (!acceptTerms) {
      alert('Veuillez accepter les conditions d\'utilisation');
      return;
    }
    // Ici vous pourrez ajouter la logique d'inscription
    onSignup();
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validation du mot de passe
  const passwordStrength = {
    hasMinLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  };

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F9FA] via-white to-[#F1F3F5] p-4 overflow-y-auto py-8">
      <div className="w-full max-w-2xl">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0A1E3F] rounded-2xl mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-[#0A1E3F] mb-2">Créer un compte</h1>
          <p className="text-[#6B7280]">Rejoignez Mes Cachets pour gérer vos revenus facilement</p>
        </div>

        {/* Formulaire d'inscription */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom et Prénom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-[#374151] mb-2">
                  Prénom
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="Jean"
                  required
                  className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A1E3F] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-[#374151] mb-2">
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Dupont"
                  required
                  className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A1E3F] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[#374151] mb-2">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="nom@exemple.fr"
                required
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A1E3F] focus:border-transparent transition-all"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-[#374151] mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A1E3F] focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#0A1E3F] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Indicateur de force du mot de passe */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        passwordStrength.hasMinLength
                          ? 'text-emerald-600'
                          : 'text-[#D1D5DB]'
                      }`}
                    />
                    <span
                      className={
                        passwordStrength.hasMinLength
                          ? 'text-[#374151]'
                          : 'text-[#9CA3AF]'
                      }
                    >
                      Au moins 8 caractères
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        passwordStrength.hasUpperCase
                          ? 'text-emerald-600'
                          : 'text-[#D1D5DB]'
                      }`}
                    />
                    <span
                      className={
                        passwordStrength.hasUpperCase
                          ? 'text-[#374151]'
                          : 'text-[#9CA3AF]'
                      }
                    >
                      Une lettre majuscule
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        passwordStrength.hasLowerCase
                          ? 'text-emerald-600'
                          : 'text-[#D1D5DB]'
                      }`}
                    />
                    <span
                      className={
                        passwordStrength.hasLowerCase
                          ? 'text-[#374151]'
                          : 'text-[#9CA3AF]'
                      }
                    >
                      Une lettre minuscule
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        passwordStrength.hasNumber
                          ? 'text-emerald-600'
                          : 'text-[#D1D5DB]'
                      }`}
                    />
                    <span
                      className={
                        passwordStrength.hasNumber
                          ? 'text-[#374151]'
                          : 'text-[#9CA3AF]'
                      }
                    >
                      Un chiffre
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-[#374151] mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A1E3F] focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#0A1E3F] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  Les mots de passe ne correspondent pas
                </p>
              )}
            </div>

            {/* Accepter les conditions */}
            <div>
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded border-[#E5E7EB] text-[#0A1E3F] focus:ring-2 focus:ring-[#0A1E3F] focus:ring-offset-0 cursor-pointer flex-shrink-0"
                />
                <span className="ml-2 text-[#6B7280] group-hover:text-[#374151] transition-colors">
                  J&apos;accepte les{' '}
                  <button type="button" className="text-[#0A1E3F] hover:underline">
                    conditions d&apos;utilisation
                  </button>{' '}
                  et la{' '}
                  <button type="button" className="text-[#0A1E3F] hover:underline">
                    politique de confidentialité
                  </button>
                </span>
              </label>
            </div>

            {/* Bouton de création de compte */}
            <button
              type="submit"
              disabled={!isPasswordStrong || formData.password !== formData.confirmPassword || !acceptTerms}
              className="w-full bg-[#0A1E3F] text-white py-3 rounded-xl hover:bg-[#152945] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0A1E3F]"
            >
              Créer mon compte
            </button>
          </form>

          {/* Séparateur */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-[#6B7280]">ou</span>
            </div>
          </div>

          {/* Retour à la connexion */}
          <div className="text-center">
            <p className="text-[#6B7280]">
              Vous avez déjà un compte ?{' '}
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-[#0A1E3F] hover:underline"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-[#9CA3AF]">
          <p>&copy; 2025 Mes Cachets. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}
