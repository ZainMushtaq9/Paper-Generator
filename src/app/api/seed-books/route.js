import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper: extract subject from book name
function extractSubject(bookName) {
    const lower = bookName.toLowerCase();
    if (lower.includes('math')) return 'Mathematics';
    if (lower.includes('english')) return 'English';
    if (lower.includes('urdu')) return 'Urdu';
    if (lower.includes('physics')) return 'Physics';
    if (lower.includes('chemistry')) return 'Chemistry';
    if (lower.includes('biology') || lower.includes('bio tech')) return 'Biology';
    if (lower.includes('computer')) return 'Computer Science';
    if (lower.includes('islamiat') || lower.includes('islamiyat')) return 'Islamiat';
    if (lower.includes('quran') || lower.includes('tarjuma')) return 'Quran';
    if (lower.includes('geography') || lower.includes('tabai') || lower.includes('insani')) return 'Geography';
    if (lower.includes('history')) return 'History';
    if (lower.includes('general science')) return 'General Science';
    if (lower.includes('pakistan studies') || lower.includes('pakstudy') || lower.includes('pak studies')) return 'Pakistan Studies';
    if (lower.includes('economics')) return 'Economics';
    if (lower.includes('civics')) return 'Civics';
    if (lower.includes('statistics')) return 'Statistics';
    if (lower.includes('akhlaq') || lower.includes('ethics')) return 'Ethics/Akhlaqiat';
    if (lower.includes('home economics') || lower.includes('ghiza') || lower.includes('parcha bafi') || lower.includes('fashion')) return 'Home Economics';
    if (lower.includes('art') || lower.includes('drawing')) return 'Art & Drawing';
    if (lower.includes('punjabi')) return 'Punjabi';
    if (lower.includes('farsi')) return 'Farsi';
    if (lower.includes('arabic')) return 'Arabic';
    if (lower.includes('waqfiyat') || lower.includes('masharti')) return 'Social Studies';
    if (lower.includes('psychology') || lower.includes('nafsiyat')) return 'Psychology';
    if (lower.includes('zari taleem')) return 'Agriculture';
    if (lower.includes('health')) return 'Health Sciences';
    if (lower.includes('communication')) return 'Communication Skills';
    if (lower.includes('ict') || lower.includes('itlaqi') || lower.includes('barqiat')) return 'ICT';
    if (lower.includes('agriculture')) return 'Agriculture';
    if (lower.includes('education') || lower.includes('taleem')) return 'Education';
    if (lower.includes('falsfa') || lower.includes('mantaq')) return 'Philosophy';
    if (lower.includes('adab') || lower.includes('muraqa')) return 'Literature';
    if (lower.includes('qaida') || lower.includes('nazra') || lower.includes('primer')) return 'Basic';
    return 'General';
}

// Helper: extract class level
function extractClass(className) {
    if (className.includes('Pre-I')) return 'Pre-1';
    if (className.includes('XI-XII') || className.includes('11-12')) return '11-12';
    if (className.includes('IX-X') || className.includes('9-10')) return '9-10';
    if (className.includes('XII') || className.includes('12')) return '12';
    if (className.includes('XI') || className.includes('11')) return '11';
    if (className.includes('VIII') || className.includes('8')) return '8';
    if (className.includes('VII') || className.includes('7')) return '7';
    if (className.includes('VI') || className.includes('6')) return '6';
    if (className.includes('V') && !className.includes('VI') && !className.includes('VII') && !className.includes('VIII')) return '5';
    if (className.includes('IV')) return '4';
    if (className.includes('III') && !className.includes('VIII')) return '3';
    if (className.includes('II') && !className.includes('III') && !className.includes('VII') && !className.includes('VIII') && !className.includes('XII')) return '2';
    if (className.includes('I') && !className.includes('II') && !className.includes('IV') && !className.includes('V') && !className.includes('X')) return '1';
    const match = className.match(/(\d+)/);
    if (match) return match[1];
    return '0';
}

// Helper: detect medium
function extractMedium(bookName) {
    const lower = bookName.toLowerCase();
    if (lower.includes('(um)') || lower.includes('urdu') || lower.includes('qaida') || lower.includes('islamiat') || lower.includes('islamiyat') || lower.includes('quran') || lower.includes('tarjuma') || lower.includes('nazra')) return 'urdu';
    return 'english';
}

// All PCTB books data
const PCTB_BOOKS = [
    // Pre-I
    { cls: 'Pre-I', title: 'Primer Mathematics', link: 'https://drive.google.com/uc?export=download&id=19m8yrU20whmA7vVkEf6i6Ej7rbkPJBbv' },
    { cls: 'Pre-I', title: 'Primer English', link: 'https://drive.google.com/uc?export=download&id=1G1H_iVUiKOmAY1MUWr4wSVJISbeoUB0Z' },
    { cls: 'Pre-I', title: 'Primer Urdu', link: 'https://drive.google.com/uc?export=download&id=1ZOzM3hFOXkTLzfbTJ3JSLnWcftxZ0mg3' },
    { cls: 'Pre-I', title: 'Neela Qaida (Optional) SRM', link: 'https://drive.google.com/uc?export=download&id=12eVQL6knNPkA3CVpJvNIXOYmeYK21Aws' },
    // Class-I
    { cls: 'Class-I', title: 'TAJVEEDI QAIDA', link: 'https://drive.google.com/uc?export=download&id=1ohWq-zOojLu0vPut9zBqUUqoiyY1gFGF' },
    { cls: 'Class-I', title: 'Urdu-1', link: 'https://drive.google.com/uc?export=download&id=17o-AGE3z00m-z8Kih389pmAeWolTxA2N' },
    { cls: 'Class-I', title: 'English-1', link: 'https://drive.google.com/uc?export=download&id=1qdIPBXxaVHia6BVInY8uXWmzKkzGZ09Y' },
    { cls: 'Class-I', title: 'Math-1 (EM)', link: 'https://drive.google.com/uc?export=download&id=1c4x62XDG-TbhF2-Aj_VIxhnm-8t8e2Ua' },
    { cls: 'Class-I', title: 'Waqfiyat e Aama (UM)', link: 'https://drive.google.com/uc?export=download&id=1pyHTreo1lqtubCL0iGBZDNFwoRaebxAG' },
    { cls: 'Class-I', title: 'Islamiat (UM)', link: 'https://drive.google.com/uc?export=download&id=1wcbkbayvUt5nv_GSvHBdVBMplTuGwLVR' },
    { cls: 'Class-I', title: 'Akhlaqiat (Optional)', link: 'https://drive.google.com/uc?export=download&id=1e5GPdHGhyfwq-RNjAJVAbXOt6Z3oP70h' },
    // Class-II
    { cls: 'Class-II', title: 'Nazra Quran', link: 'https://drive.google.com/uc?export=download&id=12c5yKIIjnyVjiV89OOKDGtE-amxkVrfF' },
    { cls: 'Class-II', title: 'Urdu-2', link: 'https://drive.google.com/uc?export=download&id=1cWaeH4aUC0xJi2kbYkmrENXmU-NnBx6L' },
    { cls: 'Class-II', title: 'English-2', link: 'https://drive.google.com/uc?export=download&id=1mDTFzH_fwjl-ZA7peQpVAxE00C3GQ2MX' },
    { cls: 'Class-II', title: 'Math-2 (EM)', link: 'https://drive.google.com/uc?export=download&id=11SMlZk9Z3mdAG49ewxxK0ge1DnvyKViZ' },
    { cls: 'Class-II', title: 'Waqfiyat e Aama (UM)', link: 'https://drive.google.com/uc?export=download&id=1zcFk3RFMgOqGpsZWtJi67kSAyDgC9kw_' },
    { cls: 'Class-II', title: 'Islamiat (UM)', link: 'https://drive.google.com/uc?export=download&id=1Z6_q9lf4H2zdXw_VInOMIUZRLFG_QL8X' },
    { cls: 'Class-II', title: 'Akhlaqiat (Optional)', link: 'https://drive.google.com/uc?export=download&id=1tyeA7dylxYzNFqQlF67JNV78tl03l2l4' },
    // Class-III
    { cls: 'Class-III', title: 'Nazra Quran', link: 'https://drive.google.com/uc?export=download&id=125VXr4hNUS_90tLX0Vx6aASghIKBcfKI' },
    { cls: 'Class-III', title: 'Urdu-3', link: 'https://drive.google.com/uc?export=download&id=1LNXCmSfpIBA2OgHSx1wn_FeOzvr-MKbn' },
    { cls: 'Class-III', title: 'English-3', link: 'https://drive.google.com/uc?export=download&id=11xsJrNr0ONZO8wJUSIq8p0SiK7tLyWZP' },
    { cls: 'Class-III', title: 'Math-3', link: 'https://drive.google.com/uc?export=download&id=1C69gAPjeD2yKfyvDG97kZIiTGJwCbTr2' },
    { cls: 'Class-III', title: 'Waqfiyat e Aama (UM)', link: 'https://drive.google.com/uc?export=download&id=120tl2Vz_PhCAAqtivosUlnh9DOiQ3Fs8' },
    { cls: 'Class-III', title: 'Islamiat (UM)', link: 'https://drive.google.com/uc?export=download&id=1aqVKG8-2-AIG3Y2K65C1KWZWB1R7XisG' },
    { cls: 'Class-III', title: 'Akhlaqiat (Optional)', link: 'https://drive.google.com/uc?export=download&id=1IiZhg6zhdlXAYNz_piPnCb4_wggIFMN2' },
    // Class-IV
    { cls: 'Class-IV', title: 'Nazra Quran', link: 'https://drive.google.com/uc?export=download&id=1Ba8QJM31iXxivUuKZLIAZZJ17PejDENB' },
    { cls: 'Class-IV', title: 'Urdu-4', link: 'https://drive.google.com/uc?export=download&id=1lmfd019QlRWK-ZBJr0Ze7eLPU1PxIbfs' },
    { cls: 'Class-IV', title: 'English-4', link: 'https://drive.google.com/uc?export=download&id=1YxAHOKvHXjdzQVy_RvoZeuugrHL3t0_e' },
    { cls: 'Class-IV', title: 'Math-4 (EM)', link: 'https://drive.google.com/uc?export=download&id=1fpvfnz1sb6arKs8fcumu-Hgl4LjM34eh' },
    { cls: 'Class-IV', title: 'General Science-4 (EM)', link: 'https://drive.google.com/uc?export=download&id=1dAS1tPwg-kAAaN6dF1M-InwLJwl8OTWK' },
    { cls: 'Class-IV', title: 'Islamiat-4 (UM)', link: 'https://drive.google.com/uc?export=download&id=13HfdenXkBOLf_3kHQHV_VH4MzoalQqXX' },
    { cls: 'Class-IV', title: 'Masharti Aloom-4 (UM)', link: 'https://drive.google.com/uc?export=download&id=1EFPSWwGq32iIT-eDGKqtVjMsOeoMHUAD' },
    { cls: 'Class-IV', title: 'Akhlaqiat (Optional)', link: 'https://drive.google.com/uc?export=download&id=1_E6f2daSK68EXKe4s-JdpzlJWcIJs6ki' },
    // Class-V
    { cls: 'Class-V', title: 'Nazra Quran', link: 'https://drive.google.com/uc?export=download&id=10seBJAaN5l1CW_sRWKto4WQZRqnKqaFz' },
    { cls: 'Class-V', title: 'Urdu-5', link: 'https://drive.google.com/uc?export=download&id=10OQQYD3q-k6-Oq9m-5PwC5mg7Y2rbX_4' },
    { cls: 'Class-V', title: 'English-5', link: 'https://drive.google.com/uc?export=download&id=1jsODAQskQsmY_SUp_4xJS7_4VB2lEfat' },
    { cls: 'Class-V', title: 'Math-5 (EM)', link: 'https://drive.google.com/uc?export=download&id=1JGSOgl61IFiwosrBQQVwLOo8FEt2tDA1' },
    { cls: 'Class-V', title: 'General Science (EM)', link: 'https://drive.google.com/uc?export=download&id=1dwl4glSoZ2c1AYVKXH1IIkTSC4B3s97E' },
    { cls: 'Class-V', title: 'Islamiat (UM)', link: 'https://drive.google.com/uc?export=download&id=1xvIrc83nySxsysX5g6u7YN-yFeGe3QLb' },
    { cls: 'Class-V', title: 'Masharti Aloom-5 (UM)', link: 'https://drive.google.com/uc?export=download&id=1FOp-kWZ_Z7hLcMsFaVxAkuzIdWVO56oe' },
    { cls: 'Class-V', title: 'Akhlaqiat (Optional)', link: 'https://drive.google.com/uc?export=download&id=1GoMHXY1XOB1O3Z1RFOMY6eWOplgAyP7-' },
    // Class-VI
    { cls: 'Class-VI', title: 'TARJUMA-TUL-QURAN-UL MAJEED', link: 'https://drive.google.com/uc?export=download&id=1U-E0-_l_ERWaoomo0KRM3xXRbMNIKheE' },
    { cls: 'Class-VI', title: 'Urdu SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1fjKTF0VJ9rGwEwrb1iYMZkuYxu4RmsdA' },
    { cls: 'Class-VI', title: 'English SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1J2WmRQ8acfiz3ZMCoWGisyE9qwnfclKY' },
    { cls: 'Class-VI', title: 'Islamiat (UM) 2022', link: 'https://drive.google.com/uc?export=download&id=1sce17Q3P-dyNorHZpSdOTfST5-OMPHce' },
    { cls: 'Class-VI', title: 'Geography SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1OyJ19YeWpIFt6zjhTrLopJdtZVp2Wd0C' },
    { cls: 'Class-VI', title: 'History SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1VhVINAr69UPAtnh3h7Ddt_KoHAidCY_4' },
    { cls: 'Class-VI', title: 'Math SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1mrKk0eG9rXxnQn2NJ2Sh_nH1U5wj2W1i' },
    { cls: 'Class-VI', title: 'General Science SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1DBdylHYJf82704FwDsr3MpQNEy1h5U-k' },
    { cls: 'Class-VI', title: 'Computer Science SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1iZWa6KY50JzkMd5I8xiiEy-64v0c7QiZ' },
    // Class-VII
    { cls: 'Class-VII', title: 'Islamiat SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1g5mgMgPAcCUB-70JoGNbKk-Vu4cYjteC' },
    { cls: 'Class-VII', title: 'Urdu SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1uqgeKN-J11LdgkNeCiJunDcXMTRirt8a' },
    { cls: 'Class-VII', title: 'English SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1EyfyU6OAE61w2RqAQQSRx_hbvVaIm9ew' },
    { cls: 'Class-VII', title: 'Math SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1aIKToDIBjBgS_8A2Thmbm46srz4r338i' },
    { cls: 'Class-VII', title: 'Geography SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1jcC0QyYAg_j0s_95ukvs-w9-eyLV9qQZ' },
    { cls: 'Class-VII', title: 'History SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=17ByBOJMShn8Mps2dOSMy5t2u7oTseZ59' },
    { cls: 'Class-VII', title: 'General Science 2023-24', link: 'https://drive.google.com/uc?export=download&id=14r9bFkXbR_lBGma5m2Bh20Mm7vhWmMpW' },
    { cls: 'Class-VII', title: 'Computer Science SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1LgxaMdjj-BiC-MEkQfSXBVXD7x4c9dy9' },
    // Class-VIII
    { cls: 'Class-VIII', title: 'English SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1VjslGe1d421x--q0gxAn2l4tYx3zAKF3' },
    { cls: 'Class-VIII', title: 'Math SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1nu_CRaFBMu2C5mgJd7Y-ekzOVITP-9rq' },
    { cls: 'Class-VIII', title: 'Geography SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1aMxVwR0tg25ZzUKF17yGYJ6WIqLlh2X1' },
    { cls: 'Class-VIII', title: 'History SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1hRe3ZTRWQrMEcnWWPJtopp-u5intUob2' },
    { cls: 'Class-VIII', title: 'General Science SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=14fpAa9TGsayEuMYuwY9gaRU9c_PKky_s' },
    { cls: 'Class-VIII', title: 'Computer Science SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1HcurSgdPnqAIuyVzzoKCDk_rGV-t5LsM' },
    { cls: 'Class-VIII', title: 'Urdu SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1b_tMiA-YJ3ujhvrQQVJ43MGR3MlQykZh' },
    { cls: 'Class-VIII', title: 'Islamiat SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=1wSqIrXtfu0qjaMKlRdMnQ3eOKG3kF-jC' },
    // Class-IX (key subjects)
    { cls: 'Class-IX', title: 'Islamiyat 2025-26', link: 'https://drive.google.com/uc?export=download&id=1kiaCqhXsXuuZ7HAAuXYfjl4_WaBf-ARS' },
    { cls: 'Class-IX', title: 'Urdu 2025-26', link: 'https://drive.google.com/uc?export=download&id=1JPgnI_hL6D0EMPG36IdjcqB2OFBHLp52' },
    { cls: 'Class-IX', title: 'English 2025-26', link: 'https://drive.google.com/uc?export=download&id=1mWBO-wzXqv0Oq9oazcjM-Y16EqmPqBtj' },
    { cls: 'Class-IX', title: 'Math (EM) 2025-26', link: 'https://drive.google.com/uc?export=download&id=1IHxM96F221JY3uL4jEIRWQ8NxskXyilF' },
    { cls: 'Class-IX', title: 'Math (UM) 2025-26', link: 'https://drive.google.com/uc?export=download&id=1uSduNMyaebkeOlAis_oh4KUBKssMAT2M' },
    { cls: 'Class-IX', title: 'Physics (EM) 2025-26', link: 'https://drive.google.com/uc?export=download&id=14TEL4poDp5vvAP7JZ3dYXJ4U_9fPexm3' },
    { cls: 'Class-IX', title: 'Chemistry (EM) 2025-26', link: 'https://drive.google.com/uc?export=download&id=1OY1Unpm8VkLCGQfbLFrE8wLn3fzXmZpc' },
    { cls: 'Class-IX', title: 'Biology (EM) 2025-26', link: 'https://drive.google.com/uc?export=download&id=1rH5qC3FM12nPcH1zIVbm25tMKWxMv-3P' },
    { cls: 'Class-IX', title: 'Computer (EM) 2025-26', link: 'https://drive.google.com/uc?export=download&id=1K9AWmNIjYFUNWE_F8JkELmlEkZO9Ms85' },
    { cls: 'Class-IX', title: 'Physics (UM)', link: 'https://drive.google.com/uc?export=download&id=1rtZ0dcffy5v-TQljJZ2YNTO5ZZC_O461' },
    { cls: 'Class-IX', title: 'Chemistry (EM) 2020', link: 'https://drive.google.com/uc?export=download&id=1ZANofRdLeLPqNXHuOHt8oilsgjs84yeT' },
    { cls: 'Class-IX', title: 'Chemistry (UM) 2020', link: 'https://drive.google.com/uc?export=download&id=1nihyc6mbyX0HHbfkGpFzcIUX2-lDJPPP' },
    { cls: 'Class-IX', title: 'Biology (UM) 2020', link: 'https://drive.google.com/uc?export=download&id=1e3G8f_Egp4v5VUiUkZxuk8c-Iomg2QKV' },
    { cls: 'Class-IX', title: 'Biology (EM)', link: 'https://drive.google.com/uc?export=download&id=1-8dIJw92YsW4BA5EmPinhHMCHRl5WuyX' },
    { cls: 'Class-IX', title: 'Computer Science (EM) 2020', link: 'https://drive.google.com/uc?export=download&id=1j8QTq_tyjH_hUbsAqrkxZnmryoLPAq4F' },
    { cls: 'Class-IX', title: 'Pakistan Studies (EM) 2023-24', link: 'https://drive.google.com/uc?export=download&id=1Z9fnK77LPs7FUHxeSEUY-w5osijGkl3t' },
    { cls: 'Class-IX', title: 'Pakistan Studies (UM) 2023-24', link: 'https://drive.google.com/uc?export=download&id=1XYODJ4j1SXfvi1u2c3YVOge6gZ2hPKt8' },
    { cls: 'Class-IX', title: 'General Math (EM) 2020', link: 'https://drive.google.com/uc?export=download&id=1NYkK6KoP96kJWpDX9YwhGLr8eaYof9T_' },
    { cls: 'Class-IX', title: 'General Math (UM) 2020', link: 'https://drive.google.com/uc?export=download&id=1DvhLz3Z_FusF9Wyv2EeItrXSucBLpoCp' },
    // Class-X (key subjects)
    { cls: 'Class-X', title: 'Math (Sc) EM 2020', link: 'https://drive.google.com/uc?export=download&id=1qdbKbuuHT80byq6gO1i6l6konU0lAoDW' },
    { cls: 'Class-X', title: 'Physics (EM)', link: 'https://drive.google.com/uc?export=download&id=1ZUhUAkGyAxbVAWIWNF6G3m1q4HTWk604' },
    { cls: 'Class-X', title: 'Chemistry (EM)', link: 'https://drive.google.com/uc?export=download&id=1Dc3uLt6sUFRPqOeIiHpGKkubOMPOxsz5' },
    { cls: 'Class-X', title: 'Biology (EM) 2020', link: 'https://drive.google.com/uc?export=download&id=1_ZseEY6DSDJZ70bY-xwzNcvDt27jJ3fY' },
    { cls: 'Class-X', title: 'Computer Science (EM)', link: 'https://drive.google.com/uc?export=download&id=1yKlB9hKd9tkz00xkmnNhzPD75mTYDzuF' },
    { cls: 'Class-X', title: 'English', link: 'https://drive.google.com/uc?export=download&id=11dohkOXSikmxJgGomYBo1TdAMfaMoPnV' },
    { cls: 'Class-X', title: 'Urdu (Compulsory)', link: 'https://drive.google.com/uc?export=download&id=18tSuH5M7a5QSarmm-hkIggxImtSp6M73' },
    { cls: 'Class-X', title: 'Pakistan Studies 2025-26', link: 'https://drive.google.com/uc?export=download&id=1piyndlFhA-eUp6sXxap58yxF7Ocsi52x' },
    { cls: 'Class-X', title: 'Islamiat SNC 2023-24', link: 'https://drive.google.com/uc?export=download&id=17pwBhL5Zcr19mcEZwa0hXuG62SYC-YfV' },
    { cls: 'Class-X', title: 'Biology (UM) 2020', link: 'https://drive.google.com/uc?export=download&id=14MARLXThhqecaUPsESYmf8qmRyYG73DX' },
    { cls: 'Class-X', title: 'Pak Studies (EM) 2025-26', link: 'https://drive.google.com/uc?export=download&id=18Ecfv-K0CgEzXFwgQxZCzCTQMq2yX1AE' },
    // Class IX-X combined
    { cls: 'Class IX-X', title: 'General Science EM 9-10', link: 'https://drive.google.com/uc?export=download&id=1JpqDG39mhcFxq0cx1pRfx3_lLR6xwsLs' },
    { cls: 'Class IX-X', title: 'English Grammar and Composition (9-10) 2023-24', link: 'https://drive.google.com/uc?export=download&id=1SOthleP3bosiOobT5Zwbi0Ceq7J091pc' },
    // Class-XI
    { cls: 'Class-XI', title: 'English 11 2025-26', link: 'https://drive.google.com/uc?export=download&id=1pGGeTfA_icnSQcNCyw_74UaVLhSXveS8' },
    { cls: 'Class-XI', title: 'Physics 11 2025-26', link: 'https://drive.google.com/uc?export=download&id=1l4lEddAJvJ_KjPOaU3hAeBmdZkG6RGiW' },
    { cls: 'Class-XI', title: 'Math 11 2025-26', link: 'https://drive.google.com/uc?export=download&id=12KTRPM54MV7_Nc9ifN_kjPMek6wT1oRX' },
    { cls: 'Class-XI', title: 'Biology 11 2025-26', link: 'https://drive.google.com/uc?export=download&id=1qEKiX0Gdpr_w2WgA7Ma4URd91UDTBVRk' },
    { cls: 'Class-XI', title: 'Chemistry 11 2025-26', link: 'https://drive.google.com/uc?export=download&id=1l-XyH9tA6AQ-DRP9QlUgG8FreYzoHjR3' },
    { cls: 'Class-XI', title: 'Computer 11 2025-26', link: 'https://drive.google.com/uc?export=download&id=1eWO5ULWhPVDUyBbKX1WM8vymr2YxmYps' },
    { cls: 'Class-XI', title: 'Islamiyat 11 2025-26', link: 'https://drive.google.com/uc?export=download&id=1YukBznawJyX9QhzxWP6DbmXYHPSzwCRW' },
    { cls: 'Class-XI', title: 'Urdu 11 2025-26', link: 'https://drive.google.com/uc?export=download&id=1eBSJe5LtViw1I078FVOT121OGJeljPVb' },
    { cls: 'Class-XI', title: 'Physics', link: 'https://drive.google.com/uc?export=download&id=15BNgMeeVTOKT7hgUYR95UhP89JjXkB3y' },
    { cls: 'Class-XI', title: 'Chemistry (EM) 2020', link: 'https://drive.google.com/uc?export=download&id=1qug6abtqmdOBhtFzZwviLrkggMq9svLQ' },
    { cls: 'Class-XI', title: 'Biology (EM) 2020', link: 'https://drive.google.com/uc?export=download&id=1SEsJqSF5DrFcXm9v7OvJX0tXIFmkdWkH' },
    { cls: 'Class-XI', title: 'Computer Science', link: 'https://drive.google.com/uc?export=download&id=1A_fvlHW-N2aBMH6XiYHkgJfmCcc4y-BZ' },
    { cls: 'Class-XI', title: 'Math 2020', link: 'https://drive.google.com/uc?export=download&id=12ZwmEwOKAAqPg58uUmkC5xU2zrqYtHtl' },
    // Class-XII
    { cls: 'Class-XII', title: 'Chemistry (EM) 2020', link: 'https://drive.google.com/uc?export=download&id=1_3_fJt9AWxRP7AQEmvhVb8n6rOOlqv3q' },
    { cls: 'Class-XII', title: 'English Book II 2020', link: 'https://drive.google.com/uc?export=download&id=1Nm-dlT0jwgFSVKaKJ6wuGGkj_naMKfsQ' },
    { cls: 'Class-XII', title: 'Mr. Chips', link: 'https://drive.google.com/uc?export=download&id=1juK6D7Z8G9el_ndHbdXqgruDU75tVFH6' },
    { cls: 'Class-XII', title: 'Biology (EM) 2020', link: 'https://drive.google.com/uc?export=download&id=1PQMrP44cXssuI1OJDCPE1YPz4dhwi_sY' },
    { cls: 'Class-XII', title: 'Math 2020', link: 'https://drive.google.com/uc?export=download&id=1WDl6Vy0FQ4A10-qyYg6cipaaniWI9CIB' },
    { cls: 'Class-XII', title: 'Computer Science', link: 'https://drive.google.com/uc?export=download&id=1cb7vS2EPLxdBJw_JWifjXZB1NriBoRJB' },
    { cls: 'Class-XII', title: 'Urdu 2020', link: 'https://drive.google.com/uc?export=download&id=11xFErLIzGIuQgZDShaBLbpkoE2cQxNjz' },
    { cls: 'Class-XII', title: 'Pakstudy-EM 2023-24', link: 'https://drive.google.com/uc?export=download&id=10yBVAqMslJgrVPyW7QEbSOHwekpukJNJ' },
    { cls: 'Class-XII', title: 'Pakstudy-UM', link: 'https://drive.google.com/uc?export=download&id=1p3SUuTOCLqAIOEGbSJdmjDlp7KHIO_0f' },
    { cls: 'Class-XII', title: 'Economics', link: 'https://drive.google.com/uc?export=download&id=1hpdlUNGLZn6LPFIawwUlB3apxin2P6EU' },
    // Class XI-XII combined
    { cls: 'Class XI-XII', title: 'English Grammar and Composition (11-12) 2023-24', link: 'https://drive.google.com/uc?export=download&id=1MjEGc8wJjMhSyyWFghg_beASRVnEqELb' },
    { cls: 'Class XI-XII', title: 'Home Economics 11-12', link: 'https://drive.google.com/uc?export=download&id=19Y6fX5qTKvJDxS4k4tPVq3c2cAtbPKTX' },
];

export async function GET() {
    try {
        const existing = await prisma.book.count();
        if (existing > 50) {
            return NextResponse.json({ message: `Books already seeded (${existing} books exist)`, count: existing });
        }

        let created = 0;
        let skipped = 0;

        for (const book of PCTB_BOOKS) {
            const classLevel = extractClass(book.cls);
            const subject = extractSubject(book.title);
            const medium = extractMedium(book.title);

            // Check if book already exists
            const exists = await prisma.book.findFirst({
                where: { title: book.title, classLevel }
            });

            if (exists) {
                skipped++;
                continue;
            }

            await prisma.book.create({
                data: {
                    title: book.title,
                    classLevel,
                    subject,
                    medium,
                    board: 'Punjab',
                    sourceType: 'official',
                    uploadType: 'pdf_text',
                    storagePath: book.link,
                    fileSize: 0,
                    ocrStatus: 'completed',
                    indexedStatus: 'completed',
                    language: medium,
                },
            });
            created++;
        }

        return NextResponse.json({
            success: true,
            message: `Seeded ${created} PCTB books (${skipped} duplicates skipped)`,
            totalInDB: await prisma.book.count(),
        });
    } catch (error) {
        console.error('Seed books error:', error);
        return NextResponse.json({ error: 'Seed failed: ' + error.message }, { status: 500 });
    }
}
