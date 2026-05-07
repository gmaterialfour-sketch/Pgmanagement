import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';

class StudentLoginScreen extends StatefulWidget {
  const StudentLoginScreen({super.key});

  @override
  State<StudentLoginScreen> createState() => _StudentLoginScreenState();
}

class _StudentLoginScreenState extends State<StudentLoginScreen> {
  bool _otpSent = false;
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Center(child: Icon(LucideIcons.graduationCap, size: 80, color: Color(0xFF4F46E5))),
            const SizedBox(height: 32),
            const Text('Student Portal', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
            Text(_otpSent ? 'Enter the 6-digit code sent to your phone' : 'Enter your phone number to get started', 
              style: const TextStyle(color: Colors.grey)),
            const SizedBox(height: 48),
            
            if (!_otpSent) ...[
              const Text('Phone Number', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              TextField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  hintText: '+91 00000 00000',
                  prefixIcon: Icon(LucideIcons.phone),
                ),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: () => setState(() => _otpSent = true),
                child: const Text('Send OTP'),
              ),
            ] else ...[
              const Text('Enter OTP', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              TextField(
                controller: _otpController,
                keyboardType: TextInputType.number,
                maxLength: 6,
                style: const TextStyle(letterSpacing: 10, fontSize: 24, fontWeight: FontWeight.bold),
                decoration: const InputDecoration(
                  hintText: '000000',
                  prefixIcon: Icon(LucideIcons.key),
                ),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: () => context.go('/student/search'),
                child: const Text('Verify & Login'),
              ),
              TextButton(
                onPressed: () => setState(() => _otpSent = false),
                child: const Text('Change Phone Number'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
