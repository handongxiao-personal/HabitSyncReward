#!/bin/bash

# HabitSync Rewards 快速部署脚本

echo "🚀 开始部署准备..."

# 1. 检查是否有未提交的更改
if [[ -n $(git status -s) ]]; then
  echo "📝 发现未提交的更改，正在提交..."
  git add .
  echo "请输入提交信息 (按 Enter 使用默认信息):"
  read commit_message
  if [ -z "$commit_message" ]; then
    commit_message="chore: 更新代码"
  fi
  git commit -m "$commit_message"
else
  echo "✅ 没有未提交的更改"
fi

# 2. 推送到 GitHub
echo "📤 推送代码到 GitHub..."
git push

echo ""
echo "✅ 代码已推送！"
echo ""
echo "📋 下一步操作："
echo "1. 如果还没有部署，请访问以下任一平台："
echo "   - Vercel: https://vercel.com (推荐)"
echo "   - Netlify: https://netlify.com"
echo ""
echo "2. 如果已经部署，你的网站会在 1-2 分钟内自动更新"
echo ""
echo "3. 详细部署指南请查看: DEPLOYMENT_GUIDE.md"

