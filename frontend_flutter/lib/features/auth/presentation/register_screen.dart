import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  String _role = 'TENANT';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0, leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.go('/login'))),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Create Account', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
            const Text('Join RentEase today', style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 32),
            const Text('Full Name', style: TextStyle(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            const TextField(
              decoration: InputDecoration(
                hintText: 'John Doe',
                prefixIcon: Icon(LucideIcons.user, size: 20),
              ),
            ),
            const SizedBox(height: 20),
            const Text('Email Address', style: TextStyle(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            const TextField(
              decoration: InputDecoration(
                hintText: 'name@company.com',
                prefixIcon: Icon(LucideIcons.mail, size: 20),
              ),
            ),
            const SizedBox(height: 20),
            const Text('Password', style: TextStyle(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            const TextField(
              obscureText: true,
              decoration: InputDecoration(
                hintText: '••••••••',
                prefixIcon: Icon(LucideIcons.lock, size: 20),
              ),
            ),
            const SizedBox(height: 20),
            const Text('I am a...', style: TextStyle(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              value: _role,
              decoration: const InputDecoration(prefixIcon: Icon(LucideIcons.briefcase, size: 20)),
              items: const [
                DropdownMenuItem(value: 'TENANT', child: Text('Tenant')),
                DropdownMenuItem(value: 'ADMIN', child: Text('Landlord / Admin')),
              ],
              onChanged: (val) => setState(() => _role = val!),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () => context.go('/admin'),
              child: const Text('Create Account'),
            ),
          ],
        ),
      ),
    );
  }
}
