#!/usr/bin/env python3
import os
import re
import sys

# Files to fix
files_to_fix = [
    "app/admin/verifications/page.tsx",
    "app/agents/page.tsx",
    "app/dashboard/page.tsx",
    "app/marketplace/add/page.tsx",
    "app/marketplace/[id]/page.tsx",
    "app/marketplace/page.tsx",
    "app/messages/[id]/page.tsx",
    "app/messages/page.tsx",
    "app/onboarding/submitted/page.tsx",
    "app/signup/page.tsx",
    "app/verify/page.tsx",
    "app/verify/status/page.tsx",
    "app/onboarding/page.tsx",
    "components/auth/AuthGuard.tsx",
    "components/onboarding/OnboardingStepper.tsx",
    "components/visualization/loop-visualization.tsx"
]

def add_dynamic_export(content):
    """Add export const dynamic = 'force-dynamic' after 'use client'"""
    if "export const dynamic = 'force-dynamic'" in content:
        return content
    
    # Find the position after 'use client'
    use_client_match = re.search(r"'use client'\n", content)
    if use_client_match:
        insert_pos = use_client_match.end()
        return content[:insert_pos] + "\n// Force dynamic rendering to avoid Supabase initialization during build\nexport const dynamic = 'force-dynamic'\n" + content[insert_pos:]
    return content

def fix_supabase_initialization(content):
    """Move createClientComponentClient() from component level to function level"""
    
    # Pattern to find: const/let/var supabase = createClientComponentClient()
    pattern = r'(\s*)(const|let|var)\s+(\w+)\s*=\s*createClientComponentClient\(\)'
    
    # Find all matches
    matches = list(re.finditer(pattern, content))
    
    if not matches:
        return content
    
    # Process from end to start to maintain positions
    for match in reversed(matches):
        var_name = match.group(3)
        indent = match.group(1)
        
        # Remove the line
        start = match.start()
        end = match.end()
        # Include the newline if present
        if end < len(content) and content[end] == '\n':
            end += 1
        
        content = content[:start] + content[end:]
        
        # Find all usages of this variable and add initialization before them
        # Look for function definitions that use this variable
        func_pattern = rf'(async\s+function\s+\w+|\w+\s*=\s*async\s*\(|const\s+\w+\s*=\s*async\s*\()[^{{]*{{[^{{]*{var_name}\.'
        
        for func_match in re.finditer(func_pattern, content):
            # Find the opening brace of the function
            brace_pos = content.find('{', func_match.start()) + 1
            # Check if we already have the initialization
            check_start = brace_pos
            check_end = min(brace_pos + 200, len(content))
            check_text = content[check_start:check_end]
            if f'const {var_name} = createClientComponentClient()' not in check_text:
                # Add the initialization
                func_indent = '  ' + indent  # Add extra indent for function body
                content = content[:brace_pos] + f'\n{func_indent}const {var_name} = createClientComponentClient()' + content[brace_pos:]
    
    return content

def process_file(filepath):
    """Process a single file"""
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return False
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Only add dynamic export to page files
    if filepath.endswith('page.tsx') or filepath.endswith('page.ts'):
        content = add_dynamic_export(content)
    
    # Fix Supabase initialization
    content = fix_supabase_initialization(content)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Fixed: {filepath}")
        return True
    else:
        print(f"ℹ️  No changes needed: {filepath}")
        return False

def main():
    """Main function"""
    print("🔧 Fixing Supabase initialization issues...")
    print(f"📁 Processing {len(files_to_fix)} files...\n")
    
    fixed_count = 0
    for filepath in files_to_fix:
        if process_file(filepath):
            fixed_count += 1
    
    print(f"\n✨ Done! Fixed {fixed_count} files.")

if __name__ == "__main__":
    main()
