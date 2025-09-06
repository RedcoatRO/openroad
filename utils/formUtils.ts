// Funcții utilitare pentru validarea și formatarea datelor din formulare

/**
 * Formatează un CUI (Cod Unic de Înregistrare) prin eliminarea tuturor caracterelor non-numerice.
 * @param value - String-ul de intrare.
 * @returns Un string care conține doar cifre.
 */
export const formatCUI = (value: string): string => {
    return value.replace(/\D/g, '');
};

/**
 * Validează un CUI.
 * @param cui - String-ul CUI de validat.
 * @returns Un mesaj de eroare (string) dacă este invalid, sau `null` dacă este valid.
 */
export const validateCUI = (cui: string): string | null => {
    const numericCUI = formatCUI(cui);
    if (!numericCUI) {
        return "CUI este obligatoriu.";
    }
    if (numericCUI.length < 2 || numericCUI.length > 10) {
        return "CUI trebuie să aibă între 2 și 10 cifre.";
    }
    return null;
};

/**
 * Formatează un număr de telefon prin eliminarea tuturor caracterelor non-numerice.
 * @param value - String-ul de intrare.
 * @returns Un string care conține doar cifre.
 */
export const formatPhone = (value: string): string => {
    return value.replace(/\D/g, '');
};

/**
 * Validează un număr de telefon românesc.
 * @param phone - String-ul de telefon de validat.
 * @returns Un mesaj de eroare (string) dacă este invalid, sau `null` dacă este valid.
 */
export const validatePhone = (phone: string): string | null => {
    const numericPhone = formatPhone(phone);
    if (!numericPhone) {
        return "Numărul de telefon este obligatoriu.";
    }
    // Verifică dacă începe cu '07' și are 10 cifre
    if (!/^07\d{8}$/.test(numericPhone)) {
        return "Numărul de telefon trebuie să fie în format românesc (ex: 07xxxxxxxx).";
    }
    return null;
};
