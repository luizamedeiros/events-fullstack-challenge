import { useTranslation } from 'react-i18next'

export const LanguageToggle = () => {
  const { i18n } = useTranslation()
  const currentLang = (i18n.resolvedLanguage || i18n.language || 'en').split(
    '-'
  )[0]

  return (
    <div className="language-toggle">
      <select
        aria-label="Select language"
        value={currentLang}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
      >
        <option value="en">🇺🇸 EN (US)</option>
        <option value="pt">🇧🇷 PT (BR)</option>
        <option value="he">🇮🇱 HE (IL)</option>
      </select>
    </div>
  )
}
