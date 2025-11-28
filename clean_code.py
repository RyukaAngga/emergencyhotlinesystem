import re
import os
from pathlib import Path

def remove_emojis(text):
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"
        "\U0001F300-\U0001F5FF"
        "\U0001F680-\U0001F6FF"
        "\U0001F1E0-\U0001F1FF"
        "\U00002702-\U000027B0"
        "\U000024C2-\U0001F251"
        "\U0001F900-\U0001F9FF"
        "\U0001F018-\U0001F270"
        "\U0001F300-\U0001F5FF"
        "\U0001FA70-\U0001FAFF"
        "]+", flags=re.UNICODE
    )
    return emoji_pattern.sub('', text)

def clean_js_file(content):
    content_no_emoji = remove_emojis(content)
    content_no_single_line = re.sub(r'^\s*//.*$', '', content_no_emoji, flags=re.MULTILINE)
    content_no_multi_line = re.sub(r'/\*[\s\S]*?\*/', '', content_no_single_line)
    lines = content_no_multi_line.split('\n')
    cleaned_lines = []
    for line in lines:
        if line.strip():
            cleaned_lines.append(line)
    return '\n'.join(cleaned_lines)

def clean_html_file(content):
    content_no_emoji = remove_emojis(content)
    content_no_html_comments = re.sub(r'<!--[\s\S]*?-->', '', content_no_emoji)
    content_no_js_single = re.sub(r'^\s*//.*$', '', content_no_html_comments, flags=re.MULTILINE)
    content_no_js_multi = re.sub(r'/\*[\s\S]*?\*/', '', content_no_js_single)
    lines = content_no_js_multi.split('\n')
    cleaned_lines = []
    prev_empty = False
    for line in lines:
        if line.strip():
            cleaned_lines.append(line)
            prev_empty = False
        elif not prev_empty:
            cleaned_lines.append(line)
            prev_empty = True
    return '\n'.join(cleaned_lines)

def clean_sql_file(content):
    content_no_emoji = remove_emojis(content)
    content_no_single_line = re.sub(r'--.*$', '', content_no_emoji, flags=re.MULTILINE)
    content_no_multi_line = re.sub(r'/\*[\s\S]*?\*/', '', content_no_single_line)
    lines = content_no_multi_line.split('\n')
    cleaned_lines = []
    for line in lines:
        if line.strip():
            cleaned_lines.append(line)
    return '\n'.join(cleaned_lines)

def clean_md_file(content):
    return remove_emojis(content)

def main():
    base_dir = Path('e:/ehs')
    
    js_files = [
        'server.js',
        'telegram-server.js',
        'face-recognition.js',
        'kiosk-mode.js'
    ]
    
    html_files = [
        'dashboard.html',
        'scan.html',
        'emergency-dashboard.html',
        'admin.html',
        'chat.html',
        'analytics.html',
        'login-admin.html',
        'login-emergency.html',
        'register-face.html',
        'scan-manual.html',
        'view-registered-faces.html'
    ]
    
    sql_files = [
        'database-schema.sql',
        'create-emergency-table.sql',
        'create-face-scans-table.sql',
        'create-kiosk-settings-table.sql',
        'fix-face-scans-columns.sql',
        'update-registered-faces-table.sql',
        'add-temperature-column.sql',
        'add-temperature-to-emergency.sql',
        'SETUP_RLS_DELETE.sql'
    ]
    
    md_files = []
    for file in base_dir.glob('*.md'):
        md_files.append(file.name)
    
    total_cleaned = 0
    
    print("Cleaning JavaScript files...")
    for filename in js_files:
        filepath = base_dir / filename
        if filepath.exists():
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            cleaned = clean_js_file(content)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(cleaned)
            print(f"  [OK] {filename}")
            total_cleaned += 1
        else:
            print(f"  [SKIP] {filename} not found")
    
    print("\nCleaning HTML files...")
    for filename in html_files:
        filepath = base_dir / filename
        if filepath.exists():
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            cleaned = clean_html_file(content)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(cleaned)
            print(f"  [OK] {filename}")
            total_cleaned += 1
        else:
            print(f"  [SKIP] {filename} not found")
    
    print("\nCleaning SQL files...")
    for filename in sql_files:
        filepath = base_dir / filename
        if filepath.exists():
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            cleaned = clean_sql_file(content)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(cleaned)
            print(f"  [OK] {filename}")
            total_cleaned += 1
        else:
            print(f"  [SKIP] {filename} not found")
    
    print("\nCleaning MD files (emoji only)...")
    for filename in md_files:
        filepath = base_dir / filename
        if filepath.exists():
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            cleaned = clean_md_file(content)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(cleaned)
            print(f"  [OK] {filename}")
            total_cleaned += 1
    
    print(f"\n===================")
    print(f"Total files cleaned: {total_cleaned}")
    print(f"===================")

if __name__ == "__main__":
    main()
