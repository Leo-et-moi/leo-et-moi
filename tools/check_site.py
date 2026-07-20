#!/usr/bin/env python3
"""check_site.py — Contrôle qualité du site leo-et-moi.
À exécuter à la racine du dépôt AVANT chaque déploiement :  python3 tools/check_site.py
Code retour 0 = OK (les avertissements n'empêchent pas le déploiement), 1 = erreurs.
Voir PLAN_RESTRUCTURATION.md §4.
"""
import json, os, re, sys
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent.parent
errors, warnings = [], []
err = errors.append
warn = warnings.append

ID_RE = re.compile(r"^(A1|A2|B1|B2|C1|C2)-(L|E|T)-\d{3,4}$")
COMPETENCES = {"listening", "reading", "writing", "speaking"}

# --- TOLÉRANCES TEMPORAIRES (état constaté le 9/07/2026, à résorber) -------
# Pages utilisant encore la voix synthétique (violation de la règle « MP3
# enregistrés uniquement ») : décision d'Eric attendue (enregistrer ou retirer
# les boutons). Signalées en AVERTISSEMENT tant qu'elles sont listées ici.
SYNTH_TOLERES = set()  # plus aucune : nettoyé le 10/07/2026
# Audios pas encore enregistrés (cf. _SOURCES/.../NOUVEAUX_AUDIOS_A_ENREGISTRER.md)
AUDIO_ATTENDUS = {
                  # B1-E-003 (Lecture Kessel) — en attente d'enregistrement
                  "B1-E-003_dq1_en.mp3", "B1-E-003_dq2_en.mp3", "B1-E-003_dq3_en.mp3", "B1-E-003_en_instr.mp3", "B1-E-003_en_instr_en.mp3", "B1-E-003_ex1_instr_en.mp3", "B1-E-003_ex2_instr_en.mp3", "B1-E-003_exA_instr_en.mp3", "B1-E-003_exB_instr_en.mp3", "B1-E-003_exC_instr_en.mp3", "B1-E-003_exc_en.mp3", "B1-E-003_exc_instr_a_en.mp3", "B1-E-003_exc_instr_b_en.mp3", "B1-E-003_exd_instr_a_en.mp3", "B1-E-003_exd_instr_b_en.mp3", "B1-E-003_exf_instr_en.mp3", "B1-E-003_methode_en.mp3", "B1-E-003_pratique_en.mp3", "B1-E-003_qcm_instr_en.mp3", "B1-E-003_qcm_q1_en.mp3", "B1-E-003_qcm_q2_en.mp3", "B1-E-003_qcm_q3_en.mp3", "B1-E-003_qcm_q4_en.mp3", "B1-E-003_qcm_q5_en.mp3", "B1-E-003_qcm_q6_en.mp3", "B1-E-003_rappel_instr_en.mp3", "B1-E-003_sec_avant_en.mp3", "B1-E-003_sec_en.mp3", "B1-E-003_sec_en_en.mp3", "B1-E-003_sec_rev_en.mp3", "B1-E-003_sec_texte_en.mp3", "B1-E-003_texte_p1_en.mp3", "B1-E-003_titre_en.mp3",
                  # A1-E-006 (Discussion passé composé) — en attente d'enregistrement
                  "A1-E-006_aide.mp3", "A1-E-006_aide_en.mp3", "A1-E-006_carte.mp3", "A1-E-006_carte_1.mp3", "A1-E-006_carte_1_en.mp3", "A1-E-006_carte_2.mp3", "A1-E-006_carte_2_en.mp3", "A1-E-006_carte_3.mp3", "A1-E-006_carte_3_en.mp3", "A1-E-006_carte_4.mp3", "A1-E-006_carte_4_en.mp3", "A1-E-006_carte_en.mp3", "A1-E-006_chemin.mp3", "A1-E-006_chemin_1.mp3", "A1-E-006_chemin_2.mp3", "A1-E-006_chemin_3.mp3", "A1-E-006_chemin_4.mp3", "A1-E-006_chemin_en.mp3", "A1-E-006_eval.mp3", "A1-E-006_eval_1.mp3", "A1-E-006_eval_1_en.mp3", "A1-E-006_eval_2.mp3", "A1-E-006_eval_2_en.mp3", "A1-E-006_eval_3.mp3", "A1-E-006_eval_3_en.mp3", "A1-E-006_eval_4.mp3", "A1-E-006_eval_4_en.mp3", "A1-E-006_eval_en.mp3", "A1-E-006_eval_expr1.mp3", "A1-E-006_eval_expr1_en.mp3", "A1-E-006_eval_expr2.mp3", "A1-E-006_eval_expr2_en.mp3", "A1-E-006_exa.mp3", "A1-E-006_exa_en.mp3", "A1-E-006_exa_instr.mp3", "A1-E-006_exa_instr_en.mp3", "A1-E-006_exa_l1.mp3", "A1-E-006_exa_l1_en.mp3", "A1-E-006_exa_l2.mp3", "A1-E-006_exa_l2_en.mp3", "A1-E-006_exa_l3.mp3", "A1-E-006_exa_l3_en.mp3", "A1-E-006_exa_l4.mp3", "A1-E-006_exa_l4_en.mp3", "A1-E-006_exa_l5.mp3", "A1-E-006_exa_l5_en.mp3", "A1-E-006_exa_l6.mp3", "A1-E-006_exa_l6_en.mp3", "A1-E-006_exa_rd.mp3", "A1-E-006_exa_rd_en.mp3", "A1-E-006_exa_rf.mp3", "A1-E-006_exa_rf_en.mp3", "A1-E-006_exb.mp3", "A1-E-006_exb_en.mp3", "A1-E-006_exb_instr.mp3", "A1-E-006_exb_instr_en.mp3", "A1-E-006_exc.mp3", "A1-E-006_exc_en.mp3", "A1-E-006_exc_instr.mp3", "A1-E-006_exc_instr_en.mp3", "A1-E-006_exc_p1.mp3", "A1-E-006_exc_p1_en.mp3", "A1-E-006_exc_p2.mp3", "A1-E-006_exc_p2_en.mp3", "A1-E-006_exc_p3.mp3", "A1-E-006_exc_p3_en.mp3", "A1-E-006_exd.mp3", "A1-E-006_exd_custom.mp3", "A1-E-006_exd_custom_en.mp3", "A1-E-006_exd_en.mp3", "A1-E-006_exd_instr.mp3", "A1-E-006_exd_instr_en.mp3", "A1-E-006_exd_q1.mp3", "A1-E-006_exd_q1_en.mp3", "A1-E-006_exd_q2.mp3", "A1-E-006_exd_q2_en.mp3", "A1-E-006_exd_q3.mp3", "A1-E-006_exd_q3_en.mp3", "A1-E-006_exd_q4.mp3", "A1-E-006_exd_q4_en.mp3", "A1-E-006_motiv.mp3", "A1-E-006_motiv_en.mp3", "A1-E-006_obj_choisir.mp3", "A1-E-006_obj_choisir_en.mp3", "A1-E-006_obj_detail.mp3", "A1-E-006_obj_detail_en.mp3", "A1-E-006_obj_histoire.mp3", "A1-E-006_obj_histoire_en.mp3", "A1-E-006_obj_je_dois.mp3", "A1-E-006_obj_ne_dois.mp3", "A1-E-006_obj_pratique.mp3", "A1-E-006_obj_pratique_en.mp3", "A1-E-006_obj_relancer.mp3", "A1-E-006_obj_relancer_en.mp3", "A1-E-006_obj_sans_erreur.mp3", "A1-E-006_obj_sans_erreur_en.mp3", "A1-E-006_obj_verbes.mp3", "A1-E-006_obj_verbes_en.mp3", "A1-E-006_sec_voc.mp3", "A1-E-006_sec_voc_en.mp3", "A1-E-006_sit_1.mp3", "A1-E-006_sit_2.mp3", "A1-E-006_sit_3.mp3", "A1-E-006_sit_4.mp3", "A1-E-006_titre.mp3", "A1-E-006_titre_en.mp3", "A1-E-006_v_aime.mp3", "A1-E-006_v_aime_en.mp3", "A1-E-006_v_avec_qui.mp3", "A1-E-006_v_avec_qui_en.mp3", "A1-E-006_v_cetait.mp3", "A1-E-006_v_cetait_en.mp3", "A1-E-006_v_comment_dit.mp3", "A1-E-006_v_comment_dit_en.mp3", "A1-E-006_v_corriger.mp3", "A1-E-006_v_corriger_en.mp3", "A1-E-006_v_etre_avoir.mp3", "A1-E-006_v_etre_avoir_en.mp3", "A1-E-006_v_hier.mp3", "A1-E-006_v_hier_en.mp3", "A1-E-006_v_jai_vu.mp3", "A1-E-006_v_jai_vu_en.mp3", "A1-E-006_v_ou.mp3", "A1-E-006_v_ou_en.mp3", "A1-E-006_v_quoi.mp3", "A1-E-006_v_quoi_en.mp3", "A1-E-006_v_weekend.mp3", "A1-E-006_v_weekend_en.mp3","a1_resume.mp3", "continue_instruction.mp3", "ref_outils.mp3",
                  "a1_res_01.mp3", "a1_res_02.mp3", "a1_res_03.mp3", "a1_res_04.mp3", "a1_res_05.mp3", "a1_res_06.mp3", "a1_res_07.mp3", "a1_res_08.mp3", "a1_res_09.mp3",
                  "A2-L-001_regle1.mp3", "A2-L-001_regle2.mp3", "A2-L-001_regle3.mp3", "A2-L-001_regle4.mp3", "A2-L-001_forme_tu.mp3", "A2-L-001_forme_nous.mp3", "A2-L-001_forme_vous.mp3", "A2-L-001_recap.mp3", "A2-L-001_pronom_en.mp3", "A2-L-001_regle4_en.mp3", "A2-L-001_forme_tu_en.mp3", "A2-L-001_regle2_en.mp3", "A2-L-001_regle1_en.mp3", "A2-L-001_v_poignet_en.mp3", "A2-L-001_v_ongles_en.mp3", "A2-L-001_v_pouce_en.mp3", "A2-L-001_v_doigts_en.mp3", "A2-L-001_v_dos_en.mp3", "A2-L-001_v_paume_en.mp3", "A2-L-001_c7_en.mp3", "A2-L-001_c6_en.mp3", "A2-L-001_c5_en.mp3", "A2-L-001_c4_en.mp3", "A2-L-001_c3_en.mp3", "A2-L-001_c2_en.mp3", "A2-L-001_c1_en.mp3", "A2-L-001_procedure.mp3", "A2-L-001_c7.mp3", "A2-L-001_c6.mp3", "A2-L-001_c5.mp3", "A2-L-001_c4.mp3", "A2-L-001_c3.mp3", "A2-L-001_c2.mp3", "A2-L-001_c1.mp3", "A2-L-001_pronom.mp3", "A2-L-001_contexte.mp3", "A2-L-001_v_paume.mp3", "A2-L-001_v_dos.mp3", "A2-L-001_v_doigts.mp3", "A2-L-001_v_pouce.mp3", "A2-L-001_v_ongles.mp3", "A2-L-001_v_poignet.mp3", "A2-L-001_v_entre.mp3", "A2-L-001_v_savon.mp3", "A2-L-001_v_robinet.mp3", "A2-E-004_q01.mp3", "A2-E-004_q02.mp3", "A2-E-004_q03.mp3", "A2-E-004_q04.mp3", "A2-E-004_q05.mp3", "A2-E-004_q06.mp3", "A2-E-004_q07.mp3", "A2-E-004_q08.mp3", "A2-E-004_q09.mp3", "A2-E-004_q10.mp3", "A2-E-004_q11.mp3", "A2-E-004_q12.mp3",
    "A1-E-005_titre_en.mp3", "A1-E-005_obj_pratique_en.mp3", "A1-E-005_obj_ecouter_en.mp3", "A1-E-005_obj_reagir_en.mp3", "A1-E-005_obj_continuer_en.mp3", "A1-E-005_obj_participer_en.mp3", "A1-E-005_obj_parler_long_en.mp3", "A1-E-005_obj_sans_erreur_en.mp3", "A1-E-005_obj_memoriser_en.mp3", "A1-E-005_sec_voc_en.mp3", "A1-E-005_v_ah_bon_en.mp3", "A1-E-005_v_cest_interessant_en.mp3", "A1-E-005_v_moi_aussi_en.mp3", "A1-E-005_v_pas_moi_en.mp3", "A1-E-005_v_et_vous_en.mp3", "A1-E-005_v_pourquoi_en.mp3", "A1-E-005_v_et_apres_en.mp3", "A1-E-005_v_avec_qui_en.mp3", "A1-E-005_v_repeter_en.mp3", "A1-E-005_v_lentement_en.mp3", "A1-E-005_v_veut_dire_en.mp3", "A1-E-005_v_comment_dit_on_en.mp3", "A1-E-005_exa_en.mp3", "A1-E-005_exa_instr_en.mp3", "A1-E-005_exa_l1_en.mp3", "A1-E-005_exa_l2_en.mp3", "A1-E-005_exa_l3_en.mp3", "A1-E-005_exa_l4_en.mp3", "A1-E-005_exa_l5_en.mp3", "A1-E-005_exa_l6_en.mp3", "A1-E-005_exb_en.mp3", "A1-E-005_exb_instr_en.mp3", "A1-E-005_exc_en.mp3", "A1-E-005_exc_instr_en.mp3", "A1-E-005_exc_p1_en.mp3", "A1-E-005_exc_p2_en.mp3", "A1-E-005_exc_p3_en.mp3", "A1-E-005_exd_en.mp3", "A1-E-005_exd_instr_en.mp3", "A1-E-005_exd_q1_en.mp3", "A1-E-005_exd_q2_en.mp3", "A1-E-005_exd_q3_en.mp3", "A1-E-005_exd_q4_en.mp3", "A1-E-005_exd_custom_en.mp3", "A1-E-005_aide_en.mp3", "A1-E-005_eval_en.mp3", "A1-E-005_eval_1_en.mp3", "A1-E-005_eval_2_en.mp3", "A1-E-005_eval_3_en.mp3", "A1-E-005_eval_4_en.mp3", "A1-E-005_eval_expr1_en.mp3", "A1-E-005_eval_expr2_en.mp3", "A1-E-005_motiv_en.mp3"}
# ---------------------------------------------------------------------------

# ---------- 1. Catalogue ----------
cat_path = ROOT / "catalog.json"
catalog = None
if not cat_path.exists():
    err("catalog.json absent de la racine")
else:
    try:
        catalog = json.loads(cat_path.read_text(encoding="utf-8"))
    except Exception as e:
        err(f"catalog.json invalide : {e}")

lecons, exercices = {}, {}
if catalog:
    for l in catalog.get("lecons", []):
        lecons[l["id"]] = l
    for e in catalog.get("exercices", []):
        exercices[e["id"]] = e
    ids = list(lecons) + list(exercices)
    for i in ids:
        if not ID_RE.match(i):
            err(f"ID mal formé : {i}")
    if len(ids) != len(set(ids)):
        err("IDs dupliqués dans le catalogue")
    for i, it in {**lecons, **exercices}.items():
        p = ROOT / it["chemin"]
        if not p.exists():
            err(f"{i} : chemin inexistant → {it['chemin']}")
    # Cohérence des liens L <-> E
    for i, e in exercices.items():
        for lid in e.get("lecons", []):
            if lid not in lecons:
                err(f"{i} : leçon référencée inconnue → {lid}")
            elif i not in lecons[lid].get("exercices", []):
                err(f"Lien asymétrique : {i} référence {lid}, mais {lid} ne référence pas {i}")
        if not e.get("lecons"):
            warn(f"{i} : aucun rattachement à une leçon (leçon pas encore créée ?)")
        comps = set(e.get("competences", []))
        if not comps:
            err(f"{i} : aucune compétence")
        if comps - COMPETENCES:
            err(f"{i} : compétence inconnue → {comps - COMPETENCES}")
        q = e.get("questions")
        if q and not (ROOT / q).exists():
            err(f"{i} : fichier questions inexistant → {q}")
    for i, l in lecons.items():
        for eid in l.get("exercices", []):
            if eid not in exercices:
                err(f"{i} : exercice référencé inconnu → {eid}")
            elif i not in exercices[eid].get("lecons", []):
                err(f"Lien asymétrique : {i} référence {eid}, mais {eid} ne référence pas {i}")

# ---------- 1b. Tests (Phase 7) ----------
if catalog:
    for ts in catalog.get("tests", []):
        i = ts.get("id", "?")
        if not ID_RE.match(i):
            err(f"Test {i} : ID mal formé")
        if not ts.get("sources"):
            err(f"Test {i} : aucune source")
        for s in ts.get("sources", []):
            if s not in exercices:
                err(f"Test {i} : source inconnue → {s}")
            elif not exercices[s].get("questions"):
                err(f"Test {i} : la source {s} n'a pas de banque de questions")
        if not isinstance(ts.get("nbQuestions"), int) or ts["nbQuestions"] < 1:
            err(f"Test {i} : nbQuestions invalide")

# ---------- 2. Fichiers de questions (Phase 6+) ----------
for i, e in exercices.items():
    q = e.get("questions")
    if not q or not (ROOT / q).exists():
        continue
    try:
        data = json.loads((ROOT / q).read_text(encoding="utf-8"))
        for n, qq in enumerate(data.get("questions", []), 1):
            opts, good = qq.get("options"), qq.get("bonneReponse")
            if opts is None or good is None or not (0 <= good < len(opts)):
                err(f"{i} : question {n} invalide dans {q} (options/bonneReponse)")
    except Exception as ex:
        err(f"{i} : {q} illisible : {ex}")

# ---------- 3. Parcours (si présent) ----------
par_path = ROOT / "parcours.json"
if par_path.exists() and catalog:
    try:
        par = json.loads(par_path.read_text(encoding="utf-8"))
        known = set(lecons) | set(exercices) | {ts["id"] for ts in catalog.get("tests", [])} | {"echauffement", "revision"}
        for s in par.get("semaines", []):
            for j in s.get("jours", []):
                for x in j.get("plan", []):
                    if x not in known:
                        err(f"parcours.json : semaine {s.get('numero')} jour {j.get('jour')} : item inconnu → {x}")
    except Exception as e:
        err(f"parcours.json invalide : {e}")

# ---------- 4. Pages HTML : intégrité, liens, audio, interdits ----------
SRC_RE = re.compile(r"""(?:src|href)\s*=\s*["']([^"'#]+?)["']""", re.I)
SKIP_PREFIX = ("http://", "https://", "mailto:", "tel:", "javascript:", "data:", "//")
html_files = [p for p in ROOT.rglob("*.html") if ".git" not in p.parts and "_TEMPLATES" not in p.parts]
for p in html_files:
    rel = p.relative_to(ROOT)
    try:
        txt = p.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        err(f"{rel} : pas en UTF-8")
        continue
    if "</html>" not in txt[-400:].lower():
        err(f"{rel} : fichier probablement tronqué (pas de </html> final)")
    if re.search(r"speechSynthesis|SpeechSynthesisUtterance", txt):
        if str(rel).replace("\\", "/") in SYNTH_TOLERES:
            warn(f"{rel} : voix synthétique encore présente (toléré temporairement — décision d'Eric attendue)")
        else:
            err(f"{rel} : audio synthétique interdit détecté (speechSynthesis)")
    for m in SRC_RE.finditer(txt):
        u = m.group(1).strip()
        # Ignorer : URLs externes, fragments de concaténation JS (ex. 'slides/slide-'),
        # valeurs sans extension de fichier.
        if not u or u.startswith(SKIP_PREFIX) or u.endswith(("-", ".", "/")):
            continue
        path_part = unquote(urlparse(u).path)
        if "." not in Path(path_part).name:
            continue
        target = (ROOT / path_part.lstrip("/")) if path_part.startswith("/") else (p.parent / path_part)
        if not target.exists():
            err(f"{rel} : lien/ressource introuvable → {m.group(1)}")

# Idem pour les .mp3 cités dans le JS inline (new Audio('...'))
# Tolère un cache-buster ?v=N après .mp3 (convention pour les audios REMPLACÉS,
# voir GUIDE §2 : seul le fichier remplacé change d'URL → pas de re-téléchargement massif)
AUDIO_RE = re.compile(r"""["']([^"']+?\.mp3)(?:\?v=\d+)?["']""")
all_mp3 = [q for q in ROOT.rglob("*.mp3") if ".git" not in q.parts]
by_name = {}
for q in all_mp3:
    by_name.setdefault(q.name, []).append(q)
for p in html_files:
    txt = p.read_text(encoding="utf-8", errors="ignore")
    for m in AUDIO_RE.finditer(txt):
        u = m.group(1)
        # Ignorer les fragments de concaténation JS (ex. '_en.mp3' accolé à un préfixe)
        if u.startswith(SKIP_PREFIX) or "${" in u or u.startswith(("_", "-")):
            continue
        if "/" in u:
            target = (ROOT / u.lstrip("/")) if u.startswith("/") else (p.parent / u)
            if not target.exists():
                err(f"{p.relative_to(ROOT)} : MP3 introuvable → {u}")
        else:
            # Nom nu : résolu à l'exécution (souvent 'audio/'+fichier) → chercher
            # dans le dossier de la page et ses sous-dossiers.
            hits = [q for q in by_name.get(u, []) if p.parent in q.parents or q.parent == p.parent]
            if not hits:
                if u in AUDIO_ATTENDUS:
                    warn(f"{p.relative_to(ROOT)} : MP3 {u} pas encore enregistré (liste NOUVEAUX_AUDIOS_A_ENREGISTRER)")
                elif u in by_name:
                    warn(f"{p.relative_to(ROOT)} : MP3 {u} absent du dossier de la page (trouvé ailleurs : {by_name[u][0].relative_to(ROOT)})")
                else:
                    err(f"{p.relative_to(ROOT)} : MP3 introuvable → {u}")

# ---------- Rapport ----------
print(f"Pages HTML analysées : {len(html_files)}")
print(f"Catalogue : {len(lecons)} leçons, {len(exercices)} exercices")
for w in warnings:
    print(f"  ⚠ AVERTISSEMENT : {w}")
for e in errors:
    print(f"  ✗ ERREUR : {e}")
if errors:
    print(f"\nÉCHEC : {len(errors)} erreur(s), {len(warnings)} avertissement(s). NE PAS DÉPLOYER.")
    sys.exit(1)
print(f"\nOK : 0 erreur, {len(warnings)} avertissement(s). Déploiement autorisé.")
