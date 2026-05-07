import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class AdminDashboard extends StatelessWidget {
  const AdminDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Dashboard', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(onPressed: () {}, icon: const Icon(LucideIcons.bell)),
          const SizedBox(width: 8),
          const CircleAvatar(backgroundColor: Color(0xFF4F46E5), child: Text('JD', style: TextStyle(color: Colors.white, fontSize: 12))),
          const SizedBox(width: 16),
        ],
      ),
      drawer: Drawer(
        child: Column(
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(color: Color(0xFF4F46E5)),
              child: Center(
                child: Text('RentEase', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
              ),
            ),
            _buildDrawerItem(LucideIcons.layoutDashboard, 'Dashboard', true),
            _buildDrawerItem(LucideIcons.building, 'Properties', false),
            _buildDrawerItem(LucideIcons.users, 'Tenants', false),
            _buildDrawerItem(LucideIcons.dollarSign, 'Payments', false),
            const Spacer(),
            _buildDrawerItem(LucideIcons.logOut, 'Logout', false, color: Colors.red),
            const SizedBox(height: 16),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Overview', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              childAspectRatio: 1.5,
              children: [
                _buildStatCard('Total Revenue', '\$12,450', LucideIcons.dollarSign, Colors.green),
                _buildStatCard('Pending', '5', LucideIcons.clock, Colors.amber),
                _buildStatCard('Properties', '12', LucideIcons.building, Colors.blue),
                _buildStatCard('Tenants', '42', LucideIcons.users, Colors.purple),
              ],
            ),
            const SizedBox(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Recent Properties', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                TextButton(onPressed: () {}, child: const Text('View All')),
              ],
            ),
            const SizedBox(height: 16),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: 3,
              itemBuilder: (context, index) {
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: Colors.indigo.shade50, borderRadius: BorderRadius.circular(8)),
                      child: const Icon(LucideIcons.home, color: Color(0xFF4F46E5)),
                    ),
                    title: Text('Green Valley Apt ${index + 1}B', style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: const Text('Silicon Valley, CA'),
                    trailing: const Icon(LucideIcons.chevronRight, size: 18),
                  ),
                );
              },
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: const Color(0xFF4F46E5),
        child: const Icon(LucideIcons.plus, color: Colors.white),
      ),
    );
  }

  Widget _buildDrawerItem(IconData icon, String label, bool isActive, {Color? color}) {
    return ListTile(
      leading: Icon(icon, color: color ?? (isActive ? const Color(0xFF4F46E5) : Colors.grey)),
      title: Text(label, style: TextStyle(color: color ?? (isActive ? const Color(0xFF4F46E5) : Colors.black87), fontWeight: isActive ? FontWeight.bold : FontWeight.normal)),
      selected: isActive,
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Icon(icon, color: color, size: 20),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                Text(title, style: const TextStyle(fontSize: 12, color: Colors.grey)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
