# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY i2t-Api/*.csproj ./
RUN dotnet restore "i2t-Api.csproj"

# Copy source and publish
COPY i2t-Api/. ./
RUN dotnet publish "i2t-Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install Tesseract & Leptonica
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy app
COPY --from=build /app/publish .

# Make sure tessdata is included
COPY i2t-Api/tessdata /usr/share/tesseract-ocr/4.00/tessdata

ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
