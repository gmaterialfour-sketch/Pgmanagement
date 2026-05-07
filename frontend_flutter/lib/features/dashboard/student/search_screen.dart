import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  bool _isGridView = false;
  final List<Map<String, dynamic>> _mockPGs = [
    {
      'name': 'Green Valley Luxury PG',
      'owner': 'Mr. Rajesh Kumar',
      'phone': '+91 9876543210',
      'rent': 12000,
      'rating': 4.5,
      'foodSafety': 4.8,
      'available': 5,
      'occupancy': 85.0,
      'nearby': '200m from Metro, 500m from City College',
      'isVerified': true,
    },
    {
      'name': 'Student Haven PG',
      'owner': 'Mrs. Anita Singh',
      'phone': '+91 8887776665',
      'rent': 8500,
      'rating': 4.0,
      'foodSafety': 3.5,
      'available': 0,
      'occupancy': 100.0,
      'nearby': 'Near Bus Stand, 1km from Railway Station',
      'isVerified': true,
    }
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nearby PGs', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: Icon(_isGridView ? LucideIcons.list : LucideIcons.layoutGrid),
            onPressed: () => setState(() => _isGridView = !_isGridView),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search by location, college...',
                prefixIcon: const Icon(LucideIcons.search),
                suffixIcon: IconButton(onPressed: () {}, icon: const Icon(LucideIcons.mapPin)),
              ),
            ),
          ),
          Expanded(
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 500),
              child: _isGridView ? _buildGrid() : _buildList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildList() {
    return ListView.builder(
      key: const ValueKey('list'),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: _mockPGs.length,
      itemBuilder: (context, index) => _buildPGCard(_mockPGs[index], false),
    );
  }

  Widget _buildGrid() {
    return GridView.builder(
      key: const ValueKey('grid'),
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.7,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: _mockPGs.length,
      itemBuilder: (context, index) => _buildPGCard(_mockPGs[index], true),
    );
  }

  Widget _buildPGCard(Map<String, dynamic> pg, bool isGrid) {
    final available = pg['available'] as int;
    final isFull = available == 0;

    return Card(
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              Container(
                height: isGrid ? 100 : 140,
                width: double.infinity,
                color: Colors.grey[200],
                child: const Icon(LucideIcons.image, size: 40, color: Colors.grey),
              ),
              if (pg['isVerified'])
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(color: Colors.blue, borderRadius: BorderRadius.circular(4)),
                    child: const Text('VERIFIED', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(pg['name'], maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 4),
                Text('By ${pg['owner']}', style: TextStyle(color: Colors.grey[600], fontSize: 12)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(LucideIcons.star, size: 14, color: Colors.amber),
                    const SizedBox(width: 4),
                    Text('${pg['rating']}'),
                    const SizedBox(width: 12),
                    Icon(LucideIcons.mapPin, size: 14, color: Colors.grey[600]),
                    const SizedBox(width: 4),
                    Text('${pg['distance']} km', style: TextStyle(color: Colors.grey[600], fontSize: 12)),
                    const Spacer(),
                    Text('₹${pg['rent']}/mo', style: const TextStyle(color: Color(0xFF4F46E5), fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: pg['priceTag'] == 'Affordable' ? Colors.green.shade50 : Colors.orange.shade50,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    pg['priceTag'].toUpperCase(),
                    style: TextStyle(
                      color: pg['priceTag'] == 'Affordable' ? Colors.green : Colors.orange,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                if (!isGrid) ...[
                  Text(pg['nearby'], style: const TextStyle(fontSize: 12, color: Colors.blueGrey)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(LucideIcons.shieldCheck, size: 14, color: Colors.green),
                      const SizedBox(width: 4),
                      Text('Food Safety: ${pg['foodSafety']}', style: const TextStyle(fontSize: 12)),
                    ],
                  ),
                ],
                const SizedBox(height: 12),
                Row(
                  children: [
                    Container(
                      height: 8,
                      width: 50,
                      decoration: BoxDecoration(color: Colors.grey[200], borderRadius: BorderRadius.circular(4)),
                      child: FractionallySizedBox(
                        alignment: Alignment.centerLeft,
                        widthFactor: pg['occupancy'] / 100,
                        child: Container(decoration: BoxDecoration(color: const Color(0xFF4F46E5), borderRadius: BorderRadius.circular(4))),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text('${pg['occupancy'].toInt()}% full', style: const TextStyle(fontSize: 10)),
                  ],
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: isFull ? null : () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isFull ? Colors.red : const Color(0xFF4F46E5),
                      padding: const EdgeInsets.symmetric(vertical: 8),
                    ),
                    child: Text(isFull ? 'NO ROOMS' : 'BOOK NOW'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 300.ms).slideY(begin: 0.1, end: 0);
  }
}
