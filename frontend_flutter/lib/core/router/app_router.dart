import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/auth/presentation/register_screen.dart';
import '../../features/dashboard/admin/admin_dashboard.dart';
import '../../features/dashboard/tenant/tenant_dashboard.dart';

import '../../features/auth/presentation/student_login_screen.dart';
import '../../features/dashboard/student/search_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const LandingScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/student/login',
        builder: (context, state) => const StudentLoginScreen(),
      ),
      GoRoute(
        path: '/student/search',
        builder: (context, state) => const SearchScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/admin',
        builder: (context, state) => const AdminDashboard(),
      ),
      GoRoute(
        path: '/tenant',
        builder: (context, state) => const TenantDashboard(),
      ),
    ],
  );
});

// Placeholder for LandingScreen
class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Welcome to RentEase', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => context.go('/login'),
              child: const Text('Admin/Landlord Login'),
            ),
            const SizedBox(height: 12),
            OutlinedButton(
              onPressed: () => context.go('/student/login'),
              style: OutlinedButton.styleFrom(minimumSize: const Size(200, 50)),
              child: const Text('Student Portal (OTP Login)'),
            ),
          ],
        ),
      ),
    );
  }
}
