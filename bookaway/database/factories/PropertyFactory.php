<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

/**
 * @extends Factory<Property>
 */
class PropertyFactory extends Factory
{
    private static int $campingIndex = 0;
    private static int $hotelIndex = 0;

    private static array $campings = [
        [
            'title' => 'Camping des Dunes de l\'Atlantique',
            'description' => 'Situé à seulement 200 mètres de la plage, ce camping ombragé par les pins maritimes vous offre calme et sérénité. Idéal pour des cours de surf et des balades à vélo en famille le long de la côte.',
        ],
        [
            'title' => 'Le Domaine de la Pinède',
            'description' => 'Niché dans un parc boisé de 5 hectares, profitez de nos emplacements spacieux et de notre grand parc aquatique chauffé avec toboggans pour petits et grands.',
        ],
        [
            'title' => 'Camping des Rives du Lac',
            'description' => 'Emplacements privatifs en bordure de lac avec accès direct à une plage de sable fin. Activités de paddle, voile et pédalo disponibles directement depuis l\'accueil.',
        ],
        [
            'title' => 'Camping de l\'Ardèche Fleurie',
            'description' => 'Au pied des célèbres falaises des Gorges de l\'Ardèche, ce camping est le point de départ rêvé pour vos descentes en canoë, randonnées pédestres et visites de villages historiques.',
        ],
        [
            'title' => 'L\'Éco-Camping de la Vallée',
            'description' => 'Un séjour 100% nature engagé pour la biodiversité. Profitez d\'emplacements sans voiture, d\'une piscine biologique et d\'ateliers d\'initiation à la permaculture.',
        ],
        [
            'title' => 'Le Clos des Cigales',
            'description' => 'Venez vivre l\'expérience provençale au son des cigales. Emplacements entourés de lavande, boulodrome éclairé pour les soirées pétanque et dégustation de produits locaux.',
        ],
        [
            'title' => 'Camping de la Crique Bleue',
            'description' => 'Un havre de paix perché sur les falaises de la Méditerranée avec accès privé à une crique préservée. Parfait pour la plongée au tuba et le farniente sous le soleil.',
        ],
        [
            'title' => 'Camping du Col de la Vanoise',
            'description' => 'Camping d\'altitude face aux cimes enneigées. Idéal pour les randonneurs, alpinistes et amateurs de nature sauvage recherchant le grand air et le calme absolu.',
        ],
        [
            'title' => 'Le Vert Bois Champêtre',
            'description' => 'Un petit camping familial à la ferme. Les enfants pourront participer aux soins des animaux et vous pourrez savourer les légumes bio produits sur place.',
        ],
        [
            'title' => 'Camping de la Source d\'Argent',
            'description' => 'Situé au cœur d\'une forêt de chênes centenaires, ce camping calme dispose d\'un accès direct à une source naturelle réputée pour sa pureté.',
        ],
        [
            'title' => 'Camping Horizon Phare',
            'description' => 'Admirez la mer à perte de vue et profitez du spectacle du coucher de soleil derrière le grand phare. Emplacements protégés du vent par des dunes naturelles.',
        ],
        [
            'title' => 'Camping de la Baie de Somme',
            'description' => 'Observez les phoques et la faune sauvage de la réserve naturelle située à quelques pas. Sorties guidées à pied ou à vélo organisées quotidiennement.',
        ],
        [
            'title' => 'Camping du Val d\'Azun',
            'description' => 'Niché dans les Pyrénées, ce camping convivial offre un magnifique panorama sur la vallée. Point de départ pour le mythique Col du Tourmalet.',
        ],
        [
            'title' => 'Le Domaine de la Cascade',
            'description' => 'Un camping pittoresque traversé par une petite rivière de montagne et sa cascade rafraîchissante. Emplacements bercés par le doux murmure de l\'eau.',
        ],
        [
            'title' => 'Camping de l\'Île Sauvage',
            'description' => 'Accessible uniquement par un pont piétonnier, vivez un séjour hors du temps sur une île boisée. Emplacements de camping sauvage tout confort.',
        ],
    ];

    private static array $hotels = [
        [
            'title' => 'Hôtel L\'Échappée Belle',
            'description' => 'Boutique-hôtel de charme situé en plein centre historique. Chambres au design soigné alliant vieilles pierres et confort moderne. Petit-déjeuner fait maison à base de produits bios.',
        ],
        [
            'title' => 'Le Grand Hôtel de la Plage',
            'description' => 'Cet établissement historique face à l\'océan propose des suites élégantes avec balcon vue mer, un accès privatif à la plage et un restaurant gastronomique récompensé.',
        ],
        [
            'title' => 'Hôtel Spa Refuge Alpin',
            'description' => 'Situé au pied des pistes, profitez d\'un accueil chaleureux dans une ambiance chalet de luxe. Notre spa haut de gamme dispose d\'un jacuzzi extérieur chauffé face aux sommets.',
        ],
        [
            'title' => 'La Villa des Oliviers',
            'description' => 'Une magnifique demeure provençale entourée d\'un jardin d\'oliviers centenaires. Piscine en pierres naturelles, salons ombragés et calme absolu à quelques minutes du village.',
        ],
        [
            'title' => 'Hôtel Le Cocon Urbain',
            'description' => 'Un établissement moderne et branché au cœur du quartier des artistes. Rooftop avec bar à cocktails offrant une vue imprenable sur les toits de la ville.',
        ],
        [
            'title' => 'Manoir du Val de Loire',
            'description' => 'Demeure d\'exception du XVIIIe siècle au milieu d\'un parc boisé. Idéal pour une escapade romantique à la découverte des châteaux de la Loire et des vignobles locaux.',
        ],
        [
            'title' => 'Hôtel Panoramique des Falaises',
            'description' => 'Perché sur la falaise normande, chaque chambre offre une vue spectaculaire sur la mer. Restaurant gastronomique proposant des fruits de mer d\'une fraîcheur absolue.',
        ],
        [
            'title' => 'L\'Hôtel Secret du Port',
            'description' => 'Hôtel confidentiel à l\'ambiance marine vintage, niché dans une impasse calme du vieux port. Terrasse ensoleillée pour le petit-déjeuner face aux voiliers.',
        ],
        [
            'title' => 'Hôtel Bellevue Altitude',
            'description' => 'Un hôtel 4 étoiles offrant un panorama grandiose sur toute la chaîne de montagnes. Chambres avec cheminée et grand balcon ensoleillé.',
        ],
        [
            'title' => 'Le Domaine de la Source Chaude',
            'description' => 'Hôtel thermal haut de gamme disposant de ses propres bains de source chaude extérieurs. Soins de balnéothérapie et cuisine saine au menu.',
        ],
        [
            'title' => 'Hôtel de la Plaine de Lavande',
            'description' => 'Un hôtel de campagne paisible au milieu des champs de lavande parfumés. Idéal pour se ressourcer loin du tumulte des grandes villes.',
        ],
        [
            'title' => 'La Villa Marine & Spa',
            'description' => 'Située face à la mer, cette villa anglo-normande offre des chambres confortables et lumineuses avec un spa moderne équipé d\'un grand hammam et sauna.',
        ],
        [
            'title' => 'Hôtel des Voyageurs Littéraires',
            'description' => 'Un hôtel à thème unique avec une bibliothèque majestueuse. Chaque chambre rend hommage à un grand écrivain avec des œuvres originales à disposition.',
        ],
        [
            'title' => 'L\'Auberge du Pont Neuf',
            'description' => 'Auberge historique restaurée avec goût au bord de la rivière. Cour intérieure fleurie pour dîner sous les treilles de vigne en été.',
        ],
        [
            'title' => 'Hôtel Horizon Ciel',
            'description' => 'Design futuriste et épuré pour cet hôtel situé au sommet d\'une colline boisée, offrant une vue à 360 degrés sur la forêt environnante.',
        ],
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['camping', 'hotel']);

        return [
            'title' => '',
            'type' => $type,
            'capacity' => fake()->numberBetween(2, 8),
            'description' => '',
            'base_price' => fake()->numberBetween(20, 60),
            'price_per_night' => fake()->numberBetween(15, 50),
            'amenities' => fake()->randomElements(['wifi', 'kitchen', 'parking', 'pool'], 3),
            'latitude' => fake()->randomFloat(8, 41, 51),
            'longitude' => fake()->randomFloat(8, 5, 9),
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure()
    {
        return $this->afterMaking(function (Property $property) {
            if (empty($property->title)) {
                if ($property->type === 'camping') {
                    $item = self::$campings[self::$campingIndex % count(self::$campings)];
                    self::$campingIndex++;
                } else {
                    $item = self::$hotels[self::$hotelIndex % count(self::$hotels)];
                    self::$hotelIndex++;
                }
                $property->title = $item['title'];
                $property->description = $item['description'];
            }
        })->afterCreating(function (Property $property) {
            $user = User::first() ?: User::factory()->create();
            $type = $property->type;
            $images = [];
            try {
                /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                $disk = Storage::disk('public');
                $files = $disk->files('properties/examples');
                $matchingFiles = array_filter($files, function ($file) use ($type) {
                    return str_starts_with(basename($file), $type);
                });
                if (!empty($matchingFiles)) {
                    $shuffled = fake()->shuffleArray($matchingFiles);
                    $selected = array_slice($shuffled, 0, fake()->numberBetween(2, min(4, count($shuffled))));
                    foreach ($selected as $file) {
                        $images[] = $file;
                    }
                }
            } catch (\Exception $e) {
            }
            if (empty($images)) {
                if ($type === 'camping') {
                    $images = [
                        'properties/examples/camping_0.jpg',
                        'properties/examples/camping_1.jpg',
                        'properties/examples/camping_2.jpg',
                    ];
                } else {
                    $images = [
                        'properties/examples/hotel_0.jpg',
                        'properties/examples/hotel_1.jpg',
                        'properties/examples/hotel_2.jpg',
                    ];
                }
            }
            foreach ($images as $index => $path) {
                $property->images()->create([
                    'path' => $path,
                    'sort_order' => $index + 1,
                    'user_id' => $user->id,
                ]);
            }
        });
    }
}
