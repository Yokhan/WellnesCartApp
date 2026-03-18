-- Clear existing seed data
TRUNCATE universal_products RESTART IDENTITY CASCADE;

INSERT INTO universal_products (
  canonical_name, brand_canonical, category, convenience_tier, use_context,
  nutriscore_grade, nutriscore_score, nova_group,
  has_trans_fats, energy_kj, proteins_g, carbohydrates_g, sugars_g,
  fat_g, saturated_fat_g, fiber_g, sodium_mg, salt_g, serving_size_g, source
) VALUES
-- PROTEIN SOURCES
('Куриное филе охлаждённое', NULL, 'poultry', '3',
  ARRAY['hot_meal','protein_source']::use_context[],
  'A', -4, '1', false, 465, 23.6, 0, 0, 1.1, 0.3, 0, 64, 0.16, 200, 'openfoodfacts'),

('Куриная грудка варёная', NULL, 'poultry', '2',
  ARRAY['hot_meal','protein_source','sandwich']::use_context[],
  'A', -5, '2', false, 540, 29.0, 0, 0, 3.5, 1.0, 0, 70, 0.18, 150, 'manual'),

('Яйцо куриное', NULL, 'eggs', '2',
  ARRAY['breakfast_ready','protein_source','hot_meal']::use_context[],
  'B', 1, '1', false, 585, 12.7, 0.7, 0.4, 10.9, 3.3, 0, 142, 0.36, 60, 'openfoodfacts'),

('Творог 5%', NULL, 'dairy', '2',
  ARRAY['breakfast_ready','protein_source','cold_snack']::use_context[],
  'A', -3, '2', false, 423, 17.0, 3.3, 3.3, 5.0, 3.3, 0, 50, 0.13, 200, 'openfoodfacts'),

('Творог 0%', NULL, 'dairy', '2',
  ARRAY['breakfast_ready','protein_source','cold_snack']::use_context[],
  'A', -5, '2', false, 326, 18.0, 3.3, 3.3, 0.5, 0.3, 0, 50, 0.13, 200, 'openfoodfacts'),

('Греческий йогурт 2%', NULL, 'dairy', '1',
  ARRAY['breakfast_ready','cold_snack','dairy']::use_context[],
  'A', -2, '2', false, 255, 6.5, 3.5, 3.5, 2.0, 1.4, 0, 40, 0.10, 150, 'openfoodfacts'),

('Лосось стейк', NULL, 'fish', '3',
  ARRAY['hot_meal','protein_source']::use_context[],
  'A', -3, '1', false, 858, 20.0, 0, 0, 13.0, 2.5, 0, 59, 0.15, 200, 'openfoodfacts'),

('Тунец в воде консервированный', NULL, 'fish', '1',
  ARRAY['sandwich','protein_source','cold_snack']::use_context[],
  'A', -6, '3', false, 490, 26.0, 0, 0, 1.0, 0.3, 0, 300, 0.75, 185, 'openfoodfacts'),

('Говядина лопатка', NULL, 'beef', '3',
  ARRAY['hot_meal','protein_source']::use_context[],
  'B', 2, '1', false, 690, 20.5, 0, 0, 8.0, 3.5, 0, 65, 0.16, 300, 'openfoodfacts'),

('Индейка фарш', NULL, 'poultry', '3',
  ARRAY['hot_meal','protein_source']::use_context[],
  'A', -2, '1', false, 556, 21.0, 0, 0, 5.5, 1.5, 0, 70, 0.18, 300, 'manual'),

-- GRAINS & CARBS
('Гречка ядрица', NULL, 'grains', '3',
  ARRAY['hot_meal','side_dish']::use_context[],
  'A', -2, '1', false, 1429, 12.6, 71.5, 0, 3.3, 0.7, 10.0, 6, 0.02, 100, 'openfoodfacts'),

('Рис длиннозёрный', NULL, 'grains', '3',
  ARRAY['hot_meal','side_dish']::use_context[],
  'B', 1, '1', false, 1473, 7.0, 76.0, 0, 0.6, 0.2, 0.4, 1, 0.003, 100, 'openfoodfacts'),

('Овсянка геркулес', NULL, 'grains', '3',
  ARRAY['breakfast_ready','hot_meal']::use_context[],
  'A', -1, '1', false, 1477, 11.0, 66.0, 1.2, 7.0, 1.3, 8.0, 6, 0.015, 80, 'openfoodfacts'),

('Макароны из твёрдых сортов', NULL, 'grains', '3',
  ARRAY['hot_meal','side_dish']::use_context[],
  'B', 2, '1', false, 1469, 12.5, 71.5, 3.0, 1.5, 0.3, 3.5, 2, 0.005, 100, 'openfoodfacts'),

('Перловка', NULL, 'grains', '3',
  ARRAY['hot_meal','side_dish']::use_context[],
  'A', -3, '1', false, 1376, 9.3, 73.7, 0, 1.1, 0.2, 15.6, 3, 0.008, 100, 'openfoodfacts'),

('Хлеб цельнозерновой', NULL, 'bread', '1',
  ARRAY['breakfast_ready','sandwich']::use_context[],
  'B', 2, '2', false, 920, 9.0, 41.0, 3.5, 3.4, 0.6, 6.5, 400, 1.0, 50, 'openfoodfacts'),

('Хлебцы рисовые', NULL, 'bread', '1',
  ARRAY['cold_snack','breakfast_ready']::use_context[],
  'B', 1, '1', false, 1560, 8.0, 79.0, 0.5, 2.5, 0.5, 2.0, 15, 0.04, 30, 'openfoodfacts'),

-- VEGETABLES
('Брокколи замороженная', NULL, 'vegetables', '3',
  ARRAY['hot_meal','side_dish']::use_context[],
  'A', -7, '1', false, 130, 3.0, 4.5, 1.7, 0.4, 0.1, 2.6, 27, 0.07, 300, 'openfoodfacts'),

('Шпинат замороженный', NULL, 'vegetables', '3',
  ARRAY['hot_meal','side_dish']::use_context[],
  'A', -8, '1', false, 100, 2.9, 2.0, 0.4, 0.4, 0.1, 2.2, 85, 0.21, 300, 'openfoodfacts'),

('Помидоры черри свежие', NULL, 'vegetables', '3',
  ARRAY['cold_snack','sandwich','side_dish']::use_context[],
  'A', -6, '1', false, 80, 0.9, 3.9, 2.6, 0.2, 0.0, 1.2, 5, 0.01, 200, 'openfoodfacts'),

('Огурцы свежие', NULL, 'vegetables', '3',
  ARRAY['cold_snack','sandwich']::use_context[],
  'A', -7, '1', false, 54, 0.7, 2.8, 1.7, 0.1, 0.0, 0.5, 2, 0.005, 200, 'openfoodfacts'),

('Картофель', NULL, 'vegetables', '3',
  ARRAY['hot_meal','side_dish']::use_context[],
  'B', 2, '1', false, 330, 2.0, 17.0, 0.8, 0.1, 0.0, 2.2, 6, 0.015, 300, 'openfoodfacts'),

('Морковь свежая', NULL, 'vegetables', '3',
  ARRAY['hot_meal','side_dish','cold_snack']::use_context[],
  'A', -5, '1', false, 154, 1.3, 9.6, 4.7, 0.2, 0.0, 2.8, 69, 0.17, 200, 'openfoodfacts'),

('Лук репчатый', NULL, 'vegetables', '3',
  ARRAY['hot_meal','condiment']::use_context[],
  'A', -4, '1', false, 163, 1.4, 9.3, 4.2, 0.2, 0.0, 1.7, 4, 0.01, 150, 'openfoodfacts'),

('Чеснок', NULL, 'vegetables', '3',
  ARRAY['condiment','hot_meal']::use_context[],
  'A', -3, '1', false, 545, 6.4, 29.9, 1.0, 0.5, 0.1, 2.1, 17, 0.04, 30, 'openfoodfacts'),

-- DAIRY
('Молоко 2.5%', NULL, 'dairy', '1',
  ARRAY['breakfast_ready','beverage','dairy']::use_context[],
  'B', 0, '2', false, 213, 2.8, 4.7, 4.7, 2.5, 1.5, 0, 40, 0.10, 250, 'openfoodfacts'),

('Кефир 1%', NULL, 'dairy', '1',
  ARRAY['breakfast_ready','dairy','beverage']::use_context[],
  'A', -2, '2', false, 168, 3.0, 4.1, 4.1, 1.0, 0.7, 0, 45, 0.11, 250, 'openfoodfacts'),

('Сыр Российский', NULL, 'dairy', '2',
  ARRAY['breakfast_ready','sandwich']::use_context[],
  'C', 5, '2', false, 1454, 23.4, 0, 0, 30.0, 19.0, 0, 880, 2.2, 50, 'openfoodfacts'),

('Сыр Тофу', NULL, 'dairy', '2',
  ARRAY['hot_meal','protein_source','cold_snack']::use_context[],
  'A', -3, '1', false, 335, 8.0, 1.4, 0.5, 4.8, 0.7, 0.3, 14, 0.04, 200, 'openfoodfacts'),

-- FATS & OILS
('Масло оливковое', NULL, 'oils', '3',
  ARRAY['condiment','hot_meal']::use_context[],
  'B', 2, '1', false, 3699, 0, 0, 0, 99.8, 14.0, 0, 0, 0.0, 30, 'openfoodfacts'),

('Масло подсолнечное рафинированное', NULL, 'oils', '3',
  ARRAY['condiment','hot_meal']::use_context[],
  'C', 6, '1', false, 3699, 0, 0, 0, 99.9, 11.0, 0, 0, 0.0, 30, 'openfoodfacts'),

-- LEGUMES
('Чечевица красная', NULL, 'legumes', '3',
  ARRAY['hot_meal','protein_source','side_dish']::use_context[],
  'A', -4, '1', false, 1393, 24.0, 63.4, 2.0, 1.1, 0.2, 11.5, 6, 0.015, 100, 'openfoodfacts'),

('Нут', NULL, 'legumes', '3',
  ARRAY['hot_meal','protein_source','side_dish']::use_context[],
  'A', -3, '1', false, 1484, 19.0, 60.0, 10.7, 6.0, 0.6, 17.4, 24, 0.06, 100, 'openfoodfacts'),

('Фасоль красная консервированная', NULL, 'legumes', '2',
  ARRAY['hot_meal','protein_source','side_dish']::use_context[],
  'A', -2, '3', false, 370, 7.8, 16.0, 1.0, 0.5, 0.1, 6.4, 290, 0.73, 200, 'openfoodfacts'),

-- NUTS & SEEDS
('Грецкий орех', NULL, 'nuts', '1',
  ARRAY['cold_snack','breakfast_ready']::use_context[],
  'A', -1, '1', false, 2726, 15.2, 13.7, 2.6, 65.2, 6.1, 6.7, 2, 0.005, 30, 'openfoodfacts'),

('Миндаль', NULL, 'nuts', '1',
  ARRAY['cold_snack','breakfast_ready']::use_context[],
  'A', -2, '1', false, 2413, 21.2, 21.7, 4.4, 49.9, 3.7, 12.5, 1, 0.003, 30, 'openfoodfacts'),

-- FRUITS
('Яблоко', NULL, 'fruits', '1',
  ARRAY['cold_snack','breakfast_ready']::use_context[],
  'A', -5, '1', false, 205, 0.3, 11.4, 10.3, 0.2, 0.0, 2.4, 1, 0.003, 150, 'openfoodfacts'),

('Банан', NULL, 'fruits', '1',
  ARRAY['cold_snack','breakfast_ready']::use_context[],
  'B', 0, '1', false, 371, 1.5, 22.0, 12.2, 0.3, 0.1, 2.6, 1, 0.003, 120, 'openfoodfacts'),

-- READY-TO-EAT
('Протеиновый батончик', NULL, 'snacks', '1',
  ARRAY['cold_snack','protein_source']::use_context[],
  'B', 1, '4', false, 1500, 30.0, 35.0, 8.0, 8.0, 3.0, 3.0, 150, 0.38, 60, 'manual'),

-- CONDIMENTS
('Горчица дижонская', NULL, 'condiments', '1',
  ARRAY['condiment','sandwich']::use_context[],
  'B', 2, '3', false, 460, 3.8, 5.3, 1.3, 7.2, 0.4, 3.0, 1048, 2.62, 20, 'openfoodfacts'),

('Соевый соус', NULL, 'condiments', '1',
  ARRAY['condiment','hot_meal']::use_context[],
  'C', 7, '3', false, 250, 8.1, 8.4, 3.0, 0.1, 0.0, 0.8, 5493, 13.73, 15, 'openfoodfacts'),

-- BEVERAGES
('Вода минеральная газированная', NULL, 'beverages', '1',
  ARRAY['beverage']::use_context[],
  'A', -10, '1', false, 0, 0, 0, 0, 0, 0, 0, 50, 0.13, 500, 'openfoodfacts'),

('Зелёный чай без сахара', NULL, 'beverages', '1',
  ARRAY['beverage']::use_context[],
  'A', -10, '1', false, 4, 0.2, 0.2, 0, 0, 0, 0, 0, 0, 250, 'manual'),

-- QUICK-COOK MEALS
('Омлет из 3 яиц', NULL, 'eggs', '2',
  ARRAY['breakfast_ready','hot_meal','protein_source']::use_context[],
  'B', 0, '2', false, 630, 14.0, 1.5, 0.8, 12.0, 4.0, 0, 220, 0.55, 180, 'manual'),

('Куриный суп', NULL, 'soups', '2',
  ARRAY['hot_meal']::use_context[],
  'A', -3, '2', false, 210, 5.5, 3.0, 0.5, 2.0, 0.5, 0.5, 280, 0.7, 350, 'manual'),

-- BREAD variants
('Хлеб Бородинский', NULL, 'bread', '1',
  ARRAY['breakfast_ready','sandwich']::use_context[],
  'B', 1, '2', false, 870, 6.8, 40.7, 5.6, 1.3, 0.2, 5.5, 580, 1.45, 50, 'openfoodfacts'),

('Тортилья цельнозерновая', NULL, 'bread', '2',
  ARRAY['sandwich','hot_meal']::use_context[],
  'B', 2, '3', false, 1100, 8.0, 47.0, 2.0, 4.0, 1.0, 4.0, 480, 1.2, 60, 'openfoodfacts'),

-- FROZEN CONVENIENCE
('Пельмени домашние', NULL, 'frozen', '2',
  ARRAY['hot_meal']::use_context[],
  'C', 8, '4', false, 910, 11.5, 29.0, 1.0, 9.5, 3.5, 1.5, 480, 1.2, 200, 'manual'),

('Котлеты индюшиные заморозка', NULL, 'frozen', '2',
  ARRAY['hot_meal','protein_source']::use_context[],
  'B', 2, '3', false, 640, 16.0, 8.0, 0.5, 6.0, 1.5, 0.5, 320, 0.8, 200, 'manual');
