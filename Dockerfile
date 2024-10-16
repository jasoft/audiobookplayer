# 使用官方 Node.js 镜像作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安装项目依赖
RUN npm ci


# 复制项目文件
COPY . .

# 构建应用
#RUN npm run build

# 暴露端口（Next.js 默认使用 3000 端口）
EXPOSE 3000

# 启动 Next.
CMD ["npm run dev"]