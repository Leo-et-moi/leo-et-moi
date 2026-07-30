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
                  # Consigne « Règle d'or » (partagée, tous exercices de nombres)
                  "nb_regle_or_en.mp3",
                  # Consignes de section (partagées A1-E-003 & A1-E-008)
                  "a1_nb_sec1_en.mp3", "a1_nb_sec2_en.mp3", "a1_nb_sec3_en.mp3", "a1_nb_sec4_en.mp3", "a1_nb_sec5_en.mp3",
                  # Nombres — incidents « défi » (dépassent 999)
                  
                  # Nombres — centaines (A1-E-008, A2-E-005, A2-E-006) en attente
                  "a2_nb_452.mp3", 
                  # B1-E-005 (Théâtre sonore — Quarantaine) — tous en attente (FR + consignes EN)
                  "B1-E-005_c1.mp3", "B1-E-005_c1_en.mp3", "B1-E-005_c2.mp3", "B1-E-005_c2_en.mp3", "B1-E-005_c3.mp3", "B1-E-005_c3_en.mp3", "B1-E-005_c4.mp3", "B1-E-005_c4_en.mp3", "B1-E-005_c5.mp3", "B1-E-005_c5_en.mp3", "B1-E-005_c6.mp3", "B1-E-005_c6_en.mp3", "B1-E-005_c7.mp3", "B1-E-005_c7_en.mp3", "B1-E-005_cnj_01.mp3", "B1-E-005_cnj_02.mp3", "B1-E-005_cnj_03.mp3", "B1-E-005_cnj_04.mp3", "B1-E-005_cnj_05.mp3", "B1-E-005_cnj_06.mp3", "B1-E-005_cnj_07.mp3", "B1-E-005_cnj_08.mp3", "B1-E-005_cnj_09.mp3", "B1-E-005_cnj_10.mp3", "B1-E-005_ctexte.mp3", "B1-E-005_ctexte_en.mp3", "B1-E-005_echo_001.mp3", "B1-E-005_echo_002.mp3", "B1-E-005_echo_003.mp3", "B1-E-005_echo_004.mp3", "B1-E-005_echo_005.mp3", "B1-E-005_echo_006.mp3", "B1-E-005_echo_007.mp3", "B1-E-005_echo_008.mp3", "B1-E-005_echo_009.mp3", "B1-E-005_echo_010.mp3", "B1-E-005_echo_011.mp3", "B1-E-005_echo_012.mp3", "B1-E-005_echo_013.mp3", "B1-E-005_echo_014.mp3", "B1-E-005_echo_015.mp3", "B1-E-005_echo_016.mp3", "B1-E-005_echo_017.mp3", "B1-E-005_echo_018.mp3", "B1-E-005_echo_019.mp3", "B1-E-005_echo_020.mp3", "B1-E-005_echo_021.mp3", "B1-E-005_echo_022.mp3", "B1-E-005_echo_023.mp3", "B1-E-005_echo_024.mp3", "B1-E-005_echo_025.mp3", "B1-E-005_echo_026.mp3", "B1-E-005_echo_027.mp3", "B1-E-005_echo_028.mp3", "B1-E-005_echo_029.mp3", "B1-E-005_echo_030.mp3", "B1-E-005_echo_031.mp3", "B1-E-005_echo_032.mp3", "B1-E-005_echo_033.mp3", "B1-E-005_echo_034.mp3", "B1-E-005_echo_035.mp3", "B1-E-005_echo_036.mp3", "B1-E-005_echo_037.mp3", "B1-E-005_echo_038.mp3", "B1-E-005_echo_039.mp3", "B1-E-005_echo_040.mp3", "B1-E-005_echo_041.mp3", "B1-E-005_echo_042.mp3", "B1-E-005_echo_043.mp3", "B1-E-005_echo_044.mp3", "B1-E-005_echo_045.mp3", "B1-E-005_echo_046.mp3", "B1-E-005_echo_047.mp3", "B1-E-005_echo_048.mp3", "B1-E-005_echo_049.mp3", "B1-E-005_echo_050.mp3", "B1-E-005_echo_051.mp3", "B1-E-005_echo_052.mp3", "B1-E-005_echo_053.mp3", "B1-E-005_echo_054.mp3", "B1-E-005_echo_055.mp3", "B1-E-005_echo_056.mp3", "B1-E-005_echo_057.mp3", "B1-E-005_echo_058.mp3", "B1-E-005_echo_059.mp3", "B1-E-005_echo_060.mp3", "B1-E-005_echo_061.mp3", "B1-E-005_echo_062.mp3", "B1-E-005_echo_063.mp3", "B1-E-005_echo_064.mp3", "B1-E-005_echo_065.mp3", "B1-E-005_echo_066.mp3", "B1-E-005_echo_067.mp3", "B1-E-005_echo_068.mp3", "B1-E-005_echo_069.mp3", "B1-E-005_echo_070.mp3", "B1-E-005_echo_071.mp3", "B1-E-005_echo_072.mp3", "B1-E-005_echo_073.mp3", "B1-E-005_echo_074.mp3", "B1-E-005_echo_075.mp3", "B1-E-005_echo_076.mp3", "B1-E-005_echo_077.mp3", "B1-E-005_echo_078.mp3", "B1-E-005_echo_079.mp3", "B1-E-005_echo_080.mp3", "B1-E-005_echo_081.mp3", "B1-E-005_echo_082.mp3", "B1-E-005_echo_083.mp3", "B1-E-005_echo_084.mp3", "B1-E-005_echo_085.mp3", "B1-E-005_echo_086.mp3", "B1-E-005_echo_087.mp3", "B1-E-005_echo_088.mp3", "B1-E-005_echo_089.mp3", "B1-E-005_echo_090.mp3", "B1-E-005_echo_091.mp3", "B1-E-005_echo_092.mp3", "B1-E-005_echo_093.mp3", "B1-E-005_echo_094.mp3", "B1-E-005_echo_095.mp3", "B1-E-005_echo_096.mp3", "B1-E-005_echo_097.mp3", "B1-E-005_echo_098.mp3", "B1-E-005_echo_099.mp3", "B1-E-005_echo_100.mp3", "B1-E-005_echo_101.mp3", "B1-E-005_echo_102.mp3", "B1-E-005_echo_103.mp3", "B1-E-005_echo_104.mp3", "B1-E-005_echo_105.mp3", "B1-E-005_echo_106.mp3", "B1-E-005_echo_107.mp3", "B1-E-005_echo_108.mp3", "B1-E-005_echo_109.mp3", "B1-E-005_echo_110.mp3", "B1-E-005_echo_111.mp3", "B1-E-005_echo_112.mp3", "B1-E-005_echo_113.mp3", "B1-E-005_echo_114.mp3", "B1-E-005_echo_115.mp3", "B1-E-005_echo_116.mp3", "B1-E-005_echo_117.mp3", "B1-E-005_echo_118.mp3", "B1-E-005_echo_119.mp3", "B1-E-005_echo_120.mp3", "B1-E-005_echo_121.mp3", "B1-E-005_echo_122.mp3", "B1-E-005_echo_123.mp3", "B1-E-005_echo_124.mp3", "B1-E-005_echo_125.mp3", "B1-E-005_echo_126.mp3", "B1-E-005_echo_127.mp3", "B1-E-005_echo_128.mp3", "B1-E-005_echo_129.mp3", "B1-E-005_echo_130.mp3", "B1-E-005_echo_131.mp3", "B1-E-005_echo_132.mp3", "B1-E-005_echo_133.mp3", "B1-E-005_echo_134.mp3", "B1-E-005_echo_135.mp3", "B1-E-005_echo_136.mp3", "B1-E-005_echo_137.mp3", "B1-E-005_echo_138.mp3", "B1-E-005_echo_139.mp3", "B1-E-005_echo_140.mp3", "B1-E-005_echo_141.mp3", "B1-E-005_echo_142.mp3", "B1-E-005_echo_143.mp3", "B1-E-005_echo_144.mp3", "B1-E-005_echo_145.mp3", "B1-E-005_echo_146.mp3", "B1-E-005_echo_147.mp3", "B1-E-005_echo_148.mp3", "B1-E-005_echo_149.mp3", "B1-E-005_echo_150.mp3", "B1-E-005_echo_151.mp3", "B1-E-005_echo_152.mp3", "B1-E-005_echo_153.mp3", "B1-E-005_echo_154.mp3", "B1-E-005_echo_155.mp3", "B1-E-005_echo_156.mp3", "B1-E-005_echo_157.mp3", "B1-E-005_echo_158.mp3", "B1-E-005_echo_159.mp3", "B1-E-005_echo_160.mp3", "B1-E-005_echo_161.mp3", "B1-E-005_echo_162.mp3", "B1-E-005_echo_163.mp3", "B1-E-005_echo_164.mp3", "B1-E-005_echo_165.mp3", "B1-E-005_echo_166.mp3", "B1-E-005_echo_167.mp3", "B1-E-005_echo_168.mp3", "B1-E-005_echo_169.mp3", "B1-E-005_echo_170.mp3", "B1-E-005_echo_171.mp3", "B1-E-005_echo_172.mp3", "B1-E-005_echo_173.mp3", "B1-E-005_echo_174.mp3", "B1-E-005_echo_175.mp3", "B1-E-005_echo_176.mp3", "B1-E-005_echo_177.mp3", "B1-E-005_echo_178.mp3", "B1-E-005_echo_179.mp3", "B1-E-005_echo_180.mp3", "B1-E-005_echo_181.mp3", "B1-E-005_echo_182.mp3", "B1-E-005_echo_183.mp3", "B1-E-005_echo_184.mp3", "B1-E-005_echo_185.mp3", "B1-E-005_echo_186.mp3", "B1-E-005_echo_187.mp3", "B1-E-005_echo_188.mp3", "B1-E-005_echo_189.mp3", "B1-E-005_echo_190.mp3", "B1-E-005_echo_191.mp3", "B1-E-005_echo_192.mp3", "B1-E-005_echo_193.mp3", "B1-E-005_echo_194.mp3", "B1-E-005_echo_195.mp3", "B1-E-005_echo_196.mp3", "B1-E-005_echo_197.mp3", "B1-E-005_echo_198.mp3", "B1-E-005_echo_199.mp3", "B1-E-005_echo_200.mp3", "B1-E-005_echo_201.mp3", "B1-E-005_echo_202.mp3", "B1-E-005_echo_203.mp3", "B1-E-005_echo_204.mp3", "B1-E-005_echo_205.mp3", "B1-E-005_echo_206.mp3", "B1-E-005_echo_207.mp3", "B1-E-005_echo_208.mp3", "B1-E-005_echo_209.mp3", "B1-E-005_echo_210.mp3", "B1-E-005_echo_211.mp3", "B1-E-005_echo_212.mp3", "B1-E-005_echo_213.mp3", "B1-E-005_echo_214.mp3", "B1-E-005_echo_215.mp3", "B1-E-005_echo_216.mp3", "B1-E-005_echo_217.mp3", "B1-E-005_echo_218.mp3", "B1-E-005_echo_219.mp3", "B1-E-005_echo_220.mp3", "B1-E-005_echo_221.mp3", "B1-E-005_echo_222.mp3", "B1-E-005_echo_223.mp3", "B1-E-005_echo_224.mp3", "B1-E-005_echo_225.mp3", "B1-E-005_echo_226.mp3", "B1-E-005_echo_227.mp3", "B1-E-005_echo_228.mp3", "B1-E-005_echo_229.mp3", "B1-E-005_echo_230.mp3", "B1-E-005_echo_231.mp3", "B1-E-005_echo_232.mp3", "B1-E-005_echo_233.mp3", "B1-E-005_echo_234.mp3", "B1-E-005_echo_235.mp3", "B1-E-005_echo_236.mp3", "B1-E-005_echo_237.mp3", "B1-E-005_echo_238.mp3", "B1-E-005_echo_239.mp3", "B1-E-005_echo_240.mp3", "B1-E-005_echo_241.mp3", "B1-E-005_echo_242.mp3", "B1-E-005_echo_243.mp3", "B1-E-005_echo_244.mp3", "B1-E-005_echo_245.mp3", "B1-E-005_echo_246.mp3", "B1-E-005_echo_247.mp3", "B1-E-005_echo_248.mp3", "B1-E-005_echo_249.mp3", "B1-E-005_echo_250.mp3", "B1-E-005_echo_251.mp3", "B1-E-005_echo_252.mp3", "B1-E-005_echo_253.mp3", "B1-E-005_echo_254.mp3", "B1-E-005_echo_255.mp3", "B1-E-005_echo_256.mp3", "B1-E-005_echo_257.mp3", "B1-E-005_idi_a-laise.mp3", "B1-E-005_idi_au-juste.mp3", "B1-E-005_idi_ciment.mp3", "B1-E-005_idi_coup-de-balai.mp3", "B1-E-005_idi_mal-parti.mp3", "B1-E-005_idi_obseques.mp3", "B1-E-005_idi_petit-a-petit.mp3", "B1-E-005_idi_tout-dun-coup.mp3", "B1-E-005_int_cache.mp3", "B1-E-005_int_cls_1.mp3", "B1-E-005_int_cls_2.mp3", "B1-E-005_int_cls_3.mp3", "B1-E-005_int_cls_4.mp3", "B1-E-005_int_cls_5.mp3", "B1-E-005_int_main_agacee.mp3", "B1-E-005_int_main_inquiete.mp3", "B1-E-005_int_main_ironique.mp3", "B1-E-005_int_main_nostalgique.mp3", "B1-E-005_int_main_surprise.mp3", "B1-E-005_intro.mp3", "B1-E-005_intro_en.mp3", "B1-E-005_inv_elle_1.mp3", "B1-E-005_inv_elle_2.mp3", "B1-E-005_inv_elle_3.mp3", "B1-E-005_inv_elle_4.mp3", "B1-E-005_inv_lui_1.mp3", "B1-E-005_inv_lui_2.mp3", "B1-E-005_inv_lui_3.mp3", "B1-E-005_inv_proj_1.mp3", "B1-E-005_inv_proj_2.mp3", "B1-E-005_inv_proj_3.mp3", "B1-E-005_qs_A.mp3", "B1-E-005_qs_B.mp3", "B1-E-005_qs_C.mp3", "B1-E-005_qs_D.mp3", "B1-E-005_qs_E.mp3", "B1-E-005_texte_integral.mp3", "B1-E-005_titre.mp3", "B1-E-005_titre_en.mp3", "B1-E-005_voc_bouquin.mp3", "B1-E-005_voc_decrepis.mp3", "B1-E-005_voc_dingue.mp3", "B1-E-005_voc_galopante.mp3", "B1-E-005_voc_gregaire.mp3", "B1-E-005_voc_mallette.mp3", "B1-E-005_voc_minaudant.mp3", "B1-E-005_voc_nourrice.mp3", "B1-E-005_voc_offusquee.mp3", "B1-E-005_voc_ribambelle.mp3", "B1-E-005_voc_subit.mp3", "B1-E-005_vrb_demenager.mp3", "B1-E-005_vrb_empecher.mp3", "B1-E-005_vrb_installer.mp3", "B1-E-005_vrb_minauder.mp3", "B1-E-005_vrb_paraitre.mp3", "B1-E-005_vrb_plaisanter.mp3", "B1-E-005_vrb_se-rassembler.mp3", "B1-E-005_vrb_se-rendre-compte.mp3", "B1-E-005_vrb_shabituer.mp3", "B1-E-005_vrb_soccuper.mp3",
                  # B1-E-004 (Théâtre sonore) — restants : cnj_09 (FR à réenregistrer) + 10 consignes/titre EN
                  "B1-E-004_c1_en.mp3", "B1-E-004_c2_en.mp3", "B1-E-004_c3_en.mp3", "B1-E-004_c4_en.mp3", "B1-E-004_c5_en.mp3", "B1-E-004_c6_en.mp3", "B1-E-004_c7_en.mp3", "B1-E-004_ctexte_en.mp3", "B1-E-004_intro_en.mp3", "B1-E-004_titre_en.mp3",
                  # B1-E-004 (Théâtre sonore — Panne de télé) — tous en attente (FR + consignes EN)
                  # B1-E-004 (Théâtre sonore — Panne de télé) — tous en attente (FR)
                  # A1-E-007 légende (prononciation des groupes) — en attente
                  
                  # A1-E-007 (Ratatouille) — consignes en attente
                  "A1-E-007_intro_en.mp3", "A1-E-007_e1_en.mp3", "A1-E-007_e2_en.mp3", "A1-E-007_e3_en.mp3", "A1-E-007_e4_en.mp3",
                  # Consignes cartes/quiz C1 (Francine + Francis) — en attente
                  "c1_fg_cards_instr_en.mp3", "c1_fg_quiz_instr_en.mp3", "c1_ft_cards_instr_en.mp3", "c1_ft_quiz_instr_en.mp3",
                  # Méthode d'écoute C1 (Francine + Francis) — en attente
                  "c1_fg_methode_en.mp3", "c1_ft_methode_en.mp3",
                  # C1-E-002 (Francis Tanguay) — en attente d'enregistrement
                  "c1_ft_highlights.mp3",
                  # B1-E-003 (Lecture Kessel) — en attente d'enregistrement
                  "B1-E-003_en_instr_en.mp3", "B1-E-003_ex1_instr_en.mp3", "B1-E-003_ex2_instr_en.mp3", "B1-E-003_exA_instr_en.mp3", "B1-E-003_exC_instr_en.mp3", "B1-E-003_exc_en.mp3", "B1-E-003_exc_instr_a_en.mp3", "B1-E-003_exc_instr_b_en.mp3", "B1-E-003_methode_en.mp3", "B1-E-003_pratique_en.mp3", "B1-E-003_qcm_instr_en.mp3", "B1-E-003_qcm_q1_en.mp3", "B1-E-003_qcm_q2_en.mp3", "B1-E-003_qcm_q3_en.mp3", "B1-E-003_qcm_q4_en.mp3", "B1-E-003_qcm_q5_en.mp3", "B1-E-003_qcm_q6_en.mp3", "B1-E-003_rappel_instr_en.mp3", "B1-E-003_sec_avant_en.mp3", "B1-E-003_sec_en_en.mp3", "B1-E-003_texte_p1_en.mp3", "B1-E-003_titre_en.mp3",
                  # A1-E-006 (Discussion passé composé) — en attente d'enregistrement
                  "A1-E-006_aide_en.mp3", "A1-E-006_carte_1_en.mp3", "A1-E-006_carte_2_en.mp3", "A1-E-006_carte_3_en.mp3", "A1-E-006_carte_4_en.mp3", "A1-E-006_carte_en.mp3", "A1-E-006_chemin_en.mp3", "A1-E-006_eval_1_en.mp3", "A1-E-006_eval_2_en.mp3", "A1-E-006_eval_3_en.mp3", "A1-E-006_eval_4_en.mp3", "A1-E-006_eval_en.mp3", "A1-E-006_eval_expr1_en.mp3", "A1-E-006_eval_expr2_en.mp3", "A1-E-006_exa_en.mp3", "A1-E-006_exa_instr_en.mp3", "A1-E-006_exa_l1_en.mp3", "A1-E-006_exa_l2_en.mp3", "A1-E-006_exa_l3_en.mp3", "A1-E-006_exa_l4_en.mp3", "A1-E-006_exa_l5_en.mp3", "A1-E-006_exa_l6_en.mp3", "A1-E-006_exa_rd_en.mp3", "A1-E-006_exa_rf_en.mp3", "A1-E-006_exb_en.mp3", "A1-E-006_exb_instr_en.mp3", "A1-E-006_exc_en.mp3", "A1-E-006_exc_instr_en.mp3", "A1-E-006_exc_p1_en.mp3", "A1-E-006_exc_p2_en.mp3", "A1-E-006_exc_p3_en.mp3", "A1-E-006_exd_custom_en.mp3", "A1-E-006_exd_en.mp3", "A1-E-006_exd_instr_en.mp3", "A1-E-006_exd_q1_en.mp3", "A1-E-006_exd_q2_en.mp3", "A1-E-006_exd_q3_en.mp3", "A1-E-006_exd_q4_en.mp3", "A1-E-006_motiv_en.mp3", "A1-E-006_obj_choisir_en.mp3", "A1-E-006_obj_detail_en.mp3", "A1-E-006_obj_histoire_en.mp3", "A1-E-006_obj_pratique_en.mp3", "A1-E-006_obj_relancer_en.mp3", "A1-E-006_obj_sans_erreur_en.mp3", "A1-E-006_obj_verbes_en.mp3", "A1-E-006_sec_voc_en.mp3", "A1-E-006_titre_en.mp3", "A1-E-006_v_aime_en.mp3", "A1-E-006_v_avec_qui_en.mp3", "A1-E-006_v_cetait_en.mp3", "A1-E-006_v_comment_dit_en.mp3", "A1-E-006_v_corriger_en.mp3", "A1-E-006_v_etre_avoir_en.mp3", "A1-E-006_v_hier_en.mp3", "A1-E-006_v_jai_vu_en.mp3", "A1-E-006_v_ou_en.mp3", "A1-E-006_v_quoi_en.mp3", "A1-E-006_v_weekend_en.mp3","a1_resume.mp3", "continue_instruction.mp3", "ref_outils.mp3",
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

# ---------- 1a-bis. Séries (génériques, 25/07) ----------
if catalog:
    sdefs = catalog.get("series", {})
    for i, e in exercices.items():
        s = e.get("serie")
        if s and s not in sdefs:
            err(f"{i} : série inconnue « {s} » (absente de la section series du catalogue)")
    for nom, d in sdefs.items():
        if not d.get("dossier"):
            err(f"Série {nom} : champ dossier manquant")
        else:
            for lvl in ["a1", "a2", "b1", "b2", "c1", "c2"]:
                if not (ROOT / "french" / d["dossier"] / f"{lvl}.html").exists():
                    err(f"Série {nom} : page french/{d['dossier']}/{lvl}.html manquante")

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
