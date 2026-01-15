import { useTranslation } from 'react-i18next'
import { LanguageToggle } from '../Language/LanguageToggle'

export const Header = () => {
  const { t } = useTranslation()
  return (
    <header className="header">
      <h1>{t('common.appTitle')}</h1>
      <LanguageToggle />
    </header>
  )
}
