import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class TenantDashboard extends StatelessWidget {
  const TenantDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Home', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(onPressed: () {}, icon: const Icon(LucideIcons.bell)),
          const SizedBox(width: 16),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Welcome back, John!', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            _buildHighlightCard(
              context,
              'Next Payment',
              '\$1,200.00',
              'Due May 1st, 2026',
              LucideIcons.creditCard,
              const Color(0xFF4F46E5),
            ),
            const SizedBox(height: 16),
            _buildHighlightCard(
              context,
              'My Apartment',
              'Apt 4B - Green Valley',
              '123 Maple Street',
              LucideIcons.home,
              Colors.blueGrey,
            ),
            const SizedBox(height: 32),
            const Text('Recent Activity', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: 2,
              itemBuilder: (context, index) {
                final isPaid = index == 1;
                return ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: CircleAvatar(
                    backgroundColor: isPaid ? Colors.green.shade50 : Colors.amber.shade50,
                    child: Icon(isPaid ? LucideIcons.check : LucideIcons.clock, color: isPaid ? Colors.green : Colors.amber, size: 20),
                  ),
                  title: Text(isPaid ? 'Rent Paid - April' : 'Rent Pending - May'),
                  subtitle: Text(isPaid ? 'Paid on March 28' : 'Due in 2 days'),
                  trailing: Text('\$1,200', style: const TextStyle(fontWeight: FontWeight.bold)),
                );
              },
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        selectedItemColor: const Color(0xFF4F46E5),
        unselectedItemColor: Colors.grey,
        currentIndex: 0,
        items: const [
          BottomNavigationBarItem(icon: Icon(LucideIcons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.creditCard), label: 'Payments'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.fileText), label: 'Documents'),
        ],
      ),
    );
  }

  Widget _buildHighlightCard(BuildContext context, String label, String title, String subtitle, IconData icon, Color color) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: color.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 5))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14)),
              Icon(icon, color: Colors.white70, size: 20),
            ],
          ),
          const SizedBox(height: 12),
          Text(title, style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(subtitle, style: const TextStyle(color: Colors.white70, fontSize: 14)),
          const SizedBox(height: 16),
          if (label == 'Next Payment')
            ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: color),
              child: const Text('Pay Now'),
            ),
        ],
      ),
    );
  }
}
