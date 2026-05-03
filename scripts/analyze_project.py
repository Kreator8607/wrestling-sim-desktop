#!/usr/bin/env python3
"""
Project Improvement Analyzer - Code Analysis Script

Analyzes a project directory and generates metrics for improvement recommendations.
Supports: JavaScript, Python, TypeScript, Java, Go projects
"""

import os
import json
import re
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Tuple

class ProjectAnalyzer:
    def __init__(self, project_path: str):
        self.project_path = Path(project_path)
        self.metrics = {
            'files': {},
            'summary': {},
            'issues': [],
            'opportunities': []
        }
    
    def analyze(self) -> Dict:
        """Run full project analysis"""
        print(f"📊 Analyzing project: {self.project_path}")
        
        self._analyze_structure()
        self._analyze_dependencies()
        self._analyze_code_quality()
        self._analyze_performance()
        self._generate_recommendations()
        
        return self.metrics
    
    def _analyze_structure(self):
        """Analyze project structure and file organization"""
        print("  ├─ Analyzing structure...")
        
        file_types = defaultdict(int)
        total_lines = 0
        
        for root, dirs, files in os.walk(self.project_path):
            # Skip common directories
            dirs[:] = [d for d in dirs if d not in [
                'node_modules', '.git', 'dist', 'build', '__pycache__', '.venv'
            ]]
            
            for file in files:
                ext = Path(file).suffix
                file_types[ext] += 1
                
                try:
                    with open(os.path.join(root, file), 'r', encoding='utf-8', errors='ignore') as f:
                        total_lines += len(f.readlines())
                except:
                    pass
        
        self.metrics['summary']['file_types'] = dict(file_types)
        self.metrics['summary']['total_lines'] = total_lines
        self.metrics['summary']['total_files'] = sum(file_types.values())
    
    def _analyze_dependencies(self):
        """Analyze project dependencies"""
        print("  ├─ Analyzing dependencies...")
        
        deps = {
            'npm': self._read_package_json(),
            'pip': self._read_requirements(),
            'go': self._read_go_mod()
        }
        
        self.metrics['summary']['dependencies'] = {
            k: len(v) for k, v in deps.items() if v
        }
        
        # Check for outdated patterns
        if deps['npm']:
            self._check_npm_patterns(deps['npm'])
    
    def _read_package_json(self) -> Dict:
        """Read package.json dependencies"""
        pkg_file = self.project_path / 'package.json'
        if pkg_file.exists():
            try:
                with open(pkg_file) as f:
                    data = json.load(f)
                    deps = data.get('dependencies', {})
                    dev_deps = data.get('devDependencies', {})
                    return {**deps, **dev_deps}
            except:
                pass
        return {}
    
    def _read_requirements(self) -> Dict:
        """Read requirements.txt dependencies"""
        req_file = self.project_path / 'requirements.txt'
        if req_file.exists():
            try:
                with open(req_file) as f:
                    return {line.split('==')[0]: line.split('==')[1] 
                           for line in f if '==' in line}
            except:
                pass
        return {}
    
    def _read_go_mod(self) -> Dict:
        """Read go.mod dependencies"""
        go_file = self.project_path / 'go.mod'
        if go_file.exists():
            try:
                with open(go_file) as f:
                    deps = {}
                    for line in f:
                        if '=>' in line:
                            parts = line.split('=>')
                            deps[parts[0].strip()] = parts[1].strip()
                    return deps
            except:
                pass
        return {}
    
    def _check_npm_patterns(self, deps: Dict):
        """Check for outdated npm patterns"""
        issues = []
        
        # Check for outdated versions
        if 'react' in deps and deps['react'].startswith('^16'):
            issues.append({
                'severity': 'high',
                'type': 'outdated_dependency',
                'message': 'React 16 is outdated. Consider upgrading to React 19+',
                'package': 'react'
            })
        
        # Check for missing testing frameworks
        test_frameworks = ['vitest', 'jest', 'mocha', 'jasmine']
        if not any(f in deps for f in test_frameworks):
            issues.append({
                'severity': 'medium',
                'type': 'missing_testing',
                'message': 'No testing framework found. Recommend: vitest or jest',
                'package': None
            })
        
        self.metrics['issues'].extend(issues)
    
    def _analyze_code_quality(self):
        """Analyze code quality metrics"""
        print("  ├─ Analyzing code quality...")
        
        quality_metrics = {
            'has_tests': self._check_tests_exist(),
            'has_linting': self._check_linting(),
            'has_ci_cd': self._check_ci_cd(),
            'has_documentation': self._check_documentation()
        }
        
        self.metrics['summary']['code_quality'] = quality_metrics
    
    def _check_tests_exist(self) -> bool:
        """Check if test files exist"""
        test_patterns = ['**/*.test.js', '**/*.test.ts', '**/*.spec.js', '**/*.spec.ts', 
                        '**/*_test.py', '**/test_*.py']
        
        for pattern in test_patterns:
            if list(self.project_path.glob(pattern)):
                return True
        return False
    
    def _check_linting(self) -> bool:
        """Check if linting is configured"""
        linting_files = ['.eslintrc', '.eslintrc.json', '.pylintrc', 'golangci.yml']
        return any((self.project_path / f).exists() for f in linting_files)
    
    def _check_ci_cd(self) -> bool:
        """Check if CI/CD is configured"""
        ci_paths = ['.github/workflows', '.gitlab-ci.yml', 'Jenkinsfile', '.circleci']
        return any((self.project_path / p).exists() for p in ci_paths)
    
    def _check_documentation(self) -> bool:
        """Check if documentation exists"""
        doc_files = ['README.md', 'docs/', 'CONTRIBUTING.md']
        return any((self.project_path / f).exists() for f in doc_files)
    
    def _analyze_performance(self):
        """Analyze performance-related patterns"""
        print("  ├─ Analyzing performance patterns...")
        
        perf_issues = []
        
        # Check for common performance anti-patterns
        for root, dirs, files in os.walk(self.project_path):
            dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist']]
            
            for file in files:
                if file.endswith(('.js', '.ts', '.jsx', '.tsx')):
                    filepath = os.path.join(root, file)
                    try:
                        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            
                            # Check for N+1 queries
                            if 'for' in content and 'query' in content.lower():
                                perf_issues.append({
                                    'severity': 'medium',
                                    'type': 'potential_n_plus_1',
                                    'file': filepath,
                                    'message': 'Potential N+1 query pattern detected'
                                })
                            
                            # Check for missing error handling
                            if 'async' in content and 'try' not in content:
                                perf_issues.append({
                                    'severity': 'medium',
                                    'type': 'missing_error_handling',
                                    'file': filepath,
                                    'message': 'Async code without error handling'
                                })
                    except:
                        pass
        
        self.metrics['issues'].extend(perf_issues[:5])  # Limit to 5 issues
    
    def _generate_recommendations(self):
        """Generate improvement opportunities"""
        print("  ├─ Generating recommendations...")
        
        recommendations = []
        
        # Performance recommendations
        if not self.metrics['summary'].get('code_quality', {}).get('has_tests'):
            recommendations.append({
                'category': 'reliability',
                'priority': 'high',
                'title': 'Add Automated Testing',
                'description': 'No test files detected. Implement unit and integration tests.',
                'effort': 'medium',
                'impact': 'high'
            })
        
        # Code quality recommendations
        if not self.metrics['summary'].get('code_quality', {}).get('has_linting'):
            recommendations.append({
                'category': 'code_quality',
                'priority': 'medium',
                'title': 'Setup Code Linting',
                'description': 'Configure ESLint or similar linting tool.',
                'effort': 'low',
                'impact': 'medium'
            })
        
        # CI/CD recommendations
        if not self.metrics['summary'].get('code_quality', {}).get('has_ci_cd'):
            recommendations.append({
                'category': 'reliability',
                'priority': 'high',
                'title': 'Setup CI/CD Pipeline',
                'description': 'Configure GitHub Actions or similar CI/CD tool.',
                'effort': 'medium',
                'impact': 'high'
            })
        
        # Documentation recommendations
        if not self.metrics['summary'].get('code_quality', {}).get('has_documentation'):
            recommendations.append({
                'category': 'maintainability',
                'priority': 'medium',
                'title': 'Improve Documentation',
                'description': 'Add README, API docs, and architecture documentation.',
                'effort': 'medium',
                'impact': 'medium'
            })
        
        self.metrics['opportunities'] = recommendations


def main():
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python analyze_project.py <project_path>")
        sys.exit(1)
    
    project_path = sys.argv[1]
    
    if not os.path.exists(project_path):
        print(f"Error: Project path not found: {project_path}")
        sys.exit(1)
    
    analyzer = ProjectAnalyzer(project_path)
    results = analyzer.analyze()
    
    print("\n✅ Analysis complete!")
    print("\n📊 Summary:")
    print(json.dumps(results['summary'], indent=2))
    
    if results['issues']:
        print("\n⚠️  Issues found:")
        for issue in results['issues'][:5]:
            print(f"  - [{issue['severity'].upper()}] {issue.get('message', issue['type'])}")
    
    if results['opportunities']:
        print("\n💡 Improvement opportunities:")
        for opp in results['opportunities']:
            print(f"  - [{opp['priority'].upper()}] {opp['title']}")
    
    # Output JSON for programmatic use
    print("\n" + json.dumps(results, indent=2))


if __name__ == '__main__':
    main()
